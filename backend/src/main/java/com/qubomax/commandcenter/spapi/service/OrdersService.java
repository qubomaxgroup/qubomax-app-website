package com.qubomax.commandcenter.spapi.service;

import com.qubomax.commandcenter.spapi.dto.DailySummaryDTO;
import com.qubomax.commandcenter.spapi.dto.OrderStatusCountDTO;
import com.qubomax.commandcenter.spapi.entity.OrderHistoryEntity;
import com.qubomax.commandcenter.spapi.model.AmazonOrder;
import com.qubomax.commandcenter.spapi.model.AmazonOrdersResponse;
import com.qubomax.commandcenter.spapi.repository.OrderHistoryRepository;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrdersService {

    private static final String DEFAULT_MARKETPLACE = "ATVPDKIKX0DER";
    private static final ZoneId MCLEAN_ZONE = ZoneId.of("America/New_York");
    private static final BigDecimal HIGH_VALUE_THRESHOLD = new BigDecimal("500.00");

    private final SpApiHttpClient spApiHttpClient;
    private final OrderHistoryRepository orderHistoryRepository;

    @Value("${spapi.marketplace-id-default:" + DEFAULT_MARKETPLACE + "}")
    private String defaultMarketplaceId;

    @Transactional
    public DailySummaryDTO getDailySummary(String marketplaceId) {
        String selectedMarketplace = marketplaceId == null || marketplaceId.isBlank()
                ? defaultMarketplaceId
                : marketplaceId;

        ZonedDateTime nowMcLean = ZonedDateTime.now(MCLEAN_ZONE);
        ZonedDateTime startOfDayMcLean = nowMcLean.toLocalDate().atStartOfDay(MCLEAN_ZONE);
        Instant createdAfterUtc = startOfDayMcLean.toInstant();

        AmazonOrdersResponse response = spApiHttpClient.fetchOrders(selectedMarketplace, createdAfterUtc);
        List<AmazonOrder> orders = response != null && response.getPayload() != null && response.getPayload().getOrders() != null
                ? response.getPayload().getOrders()
                : List.of();

        persistOrderSnapshots(orders, selectedMarketplace);

        BigDecimal totalRevenue = orders.stream()
                .map(AmazonOrder::getOrderTotal)
                .filter(Objects::nonNull)
                .map(total -> total.getAmount() == null ? BigDecimal.ZERO : total.getAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long orderCount = orders.size();
        BigDecimal averageOrderValue = orderCount == 0
                ? BigDecimal.ZERO
                : totalRevenue.divide(BigDecimal.valueOf(orderCount), 2, RoundingMode.HALF_UP);

        Map<String, Long> statusMap = orders.stream()
                .map(order -> normalizeStatus(order.getOrderStatus()))
                .collect(java.util.stream.Collectors.groupingBy(s -> s, java.util.stream.Collectors.counting()));

        long pendingCount = statusMap.getOrDefault("Pending", 0L);
        long unshippedCount = statusMap.getOrDefault("Unshipped", 0L);
        long shippedCount = statusMap.getOrDefault("Shipped", 0L);

        OrderStatusCountDTO statusCount = new OrderStatusCountDTO(pendingCount, unshippedCount, shippedCount);

        List<DailySummaryDTO.HighValueOrderDTO> highValueOrders = orders.stream()
                .filter(order -> order.getOrderTotal() != null && order.getOrderTotal().getAmount() != null)
                .filter(order -> order.getOrderTotal().getAmount().compareTo(HIGH_VALUE_THRESHOLD) > 0)
                .sorted(Comparator.comparing(o -> o.getOrderTotal().getAmount(), Comparator.reverseOrder()))
                .map(order -> DailySummaryDTO.HighValueOrderDTO.builder()
                        .amazonOrderId(order.getAmazonOrderId())
                        .orderStatus(order.getOrderStatus())
                        .fulfillmentChannel(order.getFulfillmentChannel())
                        .marketplaceId(order.getMarketplaceId())
                        .purchaseDateUtc(order.getPurchaseDate())
                        .purchaseDateMcLean(toMcLean(order.getPurchaseDate()))
                        .total(order.getOrderTotal().getAmount())
                        .currencyCode(order.getOrderTotal().getCurrencyCode())
                        .build())
                .toList();

        return DailySummaryDTO.builder()
                .marketplaceId(selectedMarketplace)
                .windowStartUtc(createdAfterUtc)
                .windowEndUtc(Instant.now())
                .windowStartMcLean(startOfDayMcLean)
                .windowEndMcLean(nowMcLean)
                .orderCount(orderCount)
                .totalRevenue(totalRevenue)
                .averageOrderValue(averageOrderValue)
                .pendingCount(pendingCount)
                .unshippedCount(unshippedCount)
                .shippedCount(shippedCount)
                .orderStatusCount(statusCount)
                .highValueThreshold(HIGH_VALUE_THRESHOLD)
                .highValueOrders(highValueOrders)
                .build();
    }

    @Transactional
    public void upsertOrderHistory(List<AmazonOrder> orders) {
        persistOrderSnapshots(orders, defaultMarketplaceId);
    }

    private void persistOrderSnapshots(List<AmazonOrder> orders, String marketplaceId) {
        List<OrderHistoryEntity> entities = new ArrayList<>(orders.size());
        for (AmazonOrder order : orders) {
            if (order.getAmazonOrderId() == null) {
                continue;
            }
            OrderHistoryEntity entity = orderHistoryRepository
                    .findByAmazonOrderId(order.getAmazonOrderId())
                    .orElseGet(OrderHistoryEntity::new);
            entity.setAmazonOrderId(order.getAmazonOrderId());
            entity.setMarketplaceId(marketplaceId);
            entity.setPurchaseDateUtc(order.getPurchaseDate());
            entity.setOrderStatus(order.getOrderStatus());
            entity.setFulfillmentChannel(order.getFulfillmentChannel());
            entity.setTotalAmount(order.getOrderTotal() != null ? order.getOrderTotal().getAmount() : BigDecimal.ZERO);
            entity.setCurrencyCode(order.getOrderTotal() != null ? order.getOrderTotal().getCurrencyCode() : "USD");
            entity.setBusinessOrder(false);
            entity.setFetchedAtUtc(Instant.now());
            entities.add(entity);
        }
        orderHistoryRepository.saveAll(entities);
    }

    private ZonedDateTime toMcLean(Instant utcTime) {
        if (utcTime == null) {
            return null;
        }
        return utcTime.atZone(ZoneId.of("UTC")).withZoneSameInstant(MCLEAN_ZONE);
    }

    private String normalizeStatus(String raw) {
        if (raw == null) {
            return "Pending";
        }
        String normalized = raw.trim().toLowerCase(Locale.ROOT);
        if (normalized.contains("unshipped")) {
            return "Unshipped";
        }
        if (normalized.contains("shipped")) {
            return "Shipped";
        }
        return "Pending";
    }
}
