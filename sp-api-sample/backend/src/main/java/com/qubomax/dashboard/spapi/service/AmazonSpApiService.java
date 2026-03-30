package com.qubomax.dashboard.spapi.service;

import com.qubomax.dashboard.spapi.dto.DailySummary;
import com.qubomax.dashboard.spapi.model.AmazonOrder;
import com.qubomax.dashboard.spapi.model.AmazonOrdersResponse;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import software.amazon.awssdk.core.exception.SdkException;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueResponse;

@Service
@RequiredArgsConstructor
public class AmazonSpApiService {

    private static final ZoneId MCLEAN_TIMEZONE = ZoneId.of("America/New_York");
    private static final BigDecimal HIGH_VALUE_THRESHOLD = new BigDecimal("500.00");
    private static final String DEFAULT_SP_API_BASE_URL = "https://sellingpartnerapi-na.amazon.com";
    private static final String LWA_TOKEN_URL = "https://api.amazon.com/auth/o2/token";

    private final WebClient.Builder webClientBuilder;
    private final SecretsManagerClient secretsManagerClient;
    private final ObjectMapper objectMapper;

    @Value("${amazon.spapi.orders-endpoint:/orders/v0/orders}")
    private String ordersEndpoint;

    @Value("${amazon.spapi.secret-id}")
    private String secretId;

    @Value("${amazon.spapi.base-url:" + DEFAULT_SP_API_BASE_URL + "}")
    private String baseUrl;

    @Value("${amazon.spapi.client-id}")
    private String clientId;

    public DailySummary getDailySummary() {
        SecretPayload secretPayload = loadSecrets();
        String lwaAccessToken = getLwaAccessToken(secretPayload);

        AmazonOrdersResponse response = fetchOrders(lwaAccessToken).block();
        List<AmazonOrder> allOrders = response != null && response.getPayload() != null && response.getPayload().getOrders() != null
                ? response.getPayload().getOrders()
                : List.of();

        Instant cutoffUtc = Instant.now().minusSeconds(24 * 60 * 60);
        List<AmazonOrder> recentOrders = allOrders.stream()
                .filter(order -> order.getPurchaseDate() != null && order.getPurchaseDate().isAfter(cutoffUtc))
                .toList();

        BigDecimal totalRevenue = recentOrders.stream()
                .map(AmazonOrder::getOrderTotal)
                .filter(Objects::nonNull)
                .map(orderTotal -> orderTotal.getAmount() == null ? BigDecimal.ZERO : orderTotal.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<DailySummary.HighValueOrder> highValueOrders = recentOrders.stream()
                .filter(order -> order.getOrderTotal() != null && order.getOrderTotal().getAmount() != null)
                .filter(order -> order.getOrderTotal().getAmount().compareTo(HIGH_VALUE_THRESHOLD) > 0)
                .sorted(Comparator.comparing(order -> order.getOrderTotal().getAmount(), Comparator.reverseOrder()))
                .map(order -> DailySummary.HighValueOrder.builder()
                        .amazonOrderId(order.getAmazonOrderId())
                        .amount(order.getOrderTotal().getAmount())
                        .purchaseDateUtc(order.getPurchaseDate())
                        .purchaseDateMcLean(convertUtcToMcLean(order.getPurchaseDate()))
                        .fulfillmentChannel(order.getFulfillmentChannel())
                        .isBusinessOrder(Boolean.TRUE.equals(order.getIsBusinessOrder()))
                        .build())
                .toList();

        List<DailySummary.OrderView> ordersWithMcLeanTime = new ArrayList<>(recentOrders.size());
        for (AmazonOrder order : recentOrders) {
            ordersWithMcLeanTime.add(DailySummary.OrderView.builder()
                    .amazonOrderId(order.getAmazonOrderId())
                    .purchaseDateUtc(order.getPurchaseDate())
                    .purchaseDateMcLean(convertUtcToMcLean(order.getPurchaseDate()))
                    .orderStatus(order.getOrderStatus())
                    .fulfillmentChannel(order.getFulfillmentChannel())
                    .isBusinessOrder(Boolean.TRUE.equals(order.getIsBusinessOrder()))
                    .amount(order.getOrderTotal() != null ? order.getOrderTotal().getAmount() : BigDecimal.ZERO)
                    .currencyCode(order.getOrderTotal() != null ? order.getOrderTotal().getCurrencyCode() : "USD")
                    .build());
        }

        return DailySummary.builder()
                .windowStartUtc(cutoffUtc)
                .windowEndUtc(Instant.now())
                .windowStartMcLean(convertUtcToMcLean(cutoffUtc))
                .windowEndMcLean(convertUtcToMcLean(Instant.now()))
                .orderCount(recentOrders.size())
                .totalRevenue(totalRevenue)
                .pendingReturns(calculatePendingReturns(recentOrders))
                .highValueThreshold(HIGH_VALUE_THRESHOLD)
                .highValueOrders(highValueOrders)
                .orders(ordersWithMcLeanTime)
                .build();
    }

    private Mono<AmazonOrdersResponse> fetchOrders(String lwaAccessToken) {
        WebClient webClient = webClientBuilder.baseUrl(baseUrl).build();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path(ordersEndpoint)
                        .queryParam("MarketplaceIds", "ATVPDKIKX0DER")
                        .queryParam("CreatedAfter", Instant.now().minusSeconds(24 * 60 * 60))
                        .build())
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + lwaAccessToken)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(AmazonOrdersResponse.class);
    }

    private SecretPayload loadSecrets() {
        try {
            GetSecretValueResponse response = secretsManagerClient.getSecretValue(
                    GetSecretValueRequest.builder().secretId(secretId).build()
            );
            return parseSecretPayload(response.secretString());
        } catch (SdkException ex) {
            throw new IllegalStateException("Failed to load SP-API secrets from AWS Secrets Manager", ex);
        }
    }

    private String getLwaAccessToken(SecretPayload secretPayload) {
        LwaTokenResponse token = webClientBuilder.baseUrl("https://api.amazon.com")
                .build()
                .post()
                .uri("/auth/o2/token")
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters
                        .fromFormData("grant_type", "refresh_token")
                        .with("refresh_token", secretPayload.getRefreshToken())
                        .with("client_id", clientId)
                        .with("client_secret", secretPayload.getClientSecret()))
                .retrieve()
                .bodyToMono(LwaTokenResponse.class)
                .block();

        if (token == null || token.getAccessToken() == null || token.getAccessToken().isBlank()) {
            throw new IllegalStateException("LWA token response was empty or missing access_token");
        }
        return token.getAccessToken();
    }

    private static ZonedDateTime convertUtcToMcLean(Instant utcTimestamp) {
        if (utcTimestamp == null) {
            return null;
        }
        return utcTimestamp.atZone(ZoneId.of("UTC")).withZoneSameInstant(MCLEAN_TIMEZONE);
    }

    private long calculatePendingReturns(List<AmazonOrder> orders) {
        return orders.stream()
                .filter(order -> Boolean.TRUE.equals(order.getIsReplacementOrder()))
                .filter(order -> order.getOrderStatus() != null && order.getOrderStatus().toLowerCase().contains("pending"))
                .count();
    }

    private SecretPayload parseSecretPayload(String json) {
        try {
            return objectMapper.readValue(json, SecretPayload.class);
        } catch (Exception ex) {
            throw new IllegalStateException("Could not parse SP-API secret payload", ex);
        }
    }

    @Data
    private static class SecretPayload {
        private String clientSecret;
        private String refreshToken;
    }

    @Data
    private static class LwaTokenResponse {
        @JsonProperty("access_token")
        private String accessToken;

        @JsonProperty("expires_in")
        private Long expiresIn;

        @JsonProperty("token_type")
        private String tokenType;
    }
}
