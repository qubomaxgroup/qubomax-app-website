package com.qubomax.commandcenter.spapi.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailySummaryDTO {

    private BigDecimal totalRevenue;
    private long orderCount;
    private BigDecimal averageOrderValue;
    private long pendingCount;
    private long unshippedCount;
    private long shippedCount;
    private String marketplaceId;
    private Instant windowStartUtc;
    private Instant windowEndUtc;
    private ZonedDateTime windowStartMcLean;
    private ZonedDateTime windowEndMcLean;
    private OrderStatusCountDTO orderStatusCount;
    private BigDecimal highValueThreshold;
    private List<HighValueOrderDTO> highValueOrders;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HighValueOrderDTO {
        private String amazonOrderId;
        private BigDecimal total;
        private String currencyCode;
        private String orderStatus;
        private String fulfillmentChannel;
        private String marketplaceId;
        private Instant purchaseDateUtc;
        private ZonedDateTime purchaseDateMcLean;
    }
}
