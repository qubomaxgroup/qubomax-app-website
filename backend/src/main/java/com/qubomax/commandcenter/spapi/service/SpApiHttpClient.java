package com.qubomax.commandcenter.spapi.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.qubomax.commandcenter.spapi.model.AmazonOrdersResponse;
import java.time.Instant;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class SpApiHttpClient {

    private final WebClient.Builder webClientBuilder;
    private final SecretManagerService secretManagerService;

    @Value("${spapi.lwa.client-id}")
    private String lwaClientId;

    @Value("${spapi.base-url:https://sellingpartnerapi-na.amazon.com}")
    private String spApiBaseUrl;

    @Value("${spapi.lwa-token-url:https://api.amazon.com/auth/o2/token}")
    private String lwaTokenUrl;

    @Value("${spapi.orders.path:/orders/v0/orders}")
    private String ordersPath;

    public AmazonOrdersResponse fetchOrders(String marketplaceId, Instant createdAfterUtc) {
        String accessToken = exchangeRefreshTokenForAccessToken();
        WebClient webClient = webClientBuilder.build();

        return webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .scheme("https")
                        .host(spApiBaseUrl.replace("https://", "").replace("http://", ""))
                        .path(ordersPath)
                        .queryParam("MarketplaceIds", marketplaceId)
                        .queryParam("CreatedAfter", createdAfterUtc)
                        .build())
                .headers(headers -> {
                    headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
                    headers.setContentType(MediaType.APPLICATION_JSON);
                })
                .retrieve()
                .bodyToMono(AmazonOrdersResponse.class)
                .block();
    }

    private String exchangeRefreshTokenForAccessToken() {
        String refreshToken = secretManagerService.getSpApiRefreshToken();
        String clientSecret = secretManagerService.getSpApiClientSecret();
        WebClient webClient = webClientBuilder.build();

        LwaTokenResponse response = webClient.post()
                .uri(lwaTokenUrl)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(BodyInserters
                        .fromFormData("grant_type", "refresh_token")
                        .with("refresh_token", refreshToken)
                        .with("client_id", lwaClientId)
                        .with("client_secret", clientSecret))
                .retrieve()
                .bodyToMono(LwaTokenResponse.class)
                .block();

        if (response == null || response.getAccessToken() == null || response.getAccessToken().isBlank()) {
            throw new IllegalStateException("Could not obtain LWA access token.");
        }
        return response.getAccessToken();
    }

    @Data
    private static class LwaTokenResponse {
        @JsonProperty("access_token")
        private String accessToken;
    }
}
