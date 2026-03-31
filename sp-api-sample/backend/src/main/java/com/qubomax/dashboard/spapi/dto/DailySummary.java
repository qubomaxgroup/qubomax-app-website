package com.qubomax.dashboard.spapi.dto;

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
public class DailySummary {

    private Instant windowStartUtc;
    private Instant windowEndUtc;
    private ZonedDateTime windowStartMcLean;
    private ZonedDateTime windowEndMcLean;
    private BigDecimal totalRevenue;
    private long orderCount;
    private long pendingReturns;
    private BigDecimal highValueThreshold;
    private List<HighValueOrder> highValueOrders;
    private List<OrderView> orders;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HighValueOrder {
        private String amazonOrderId;
        private BigDecimal amount;
        private Instant purchaseDateUtc;
        private ZonedDateTime purchaseDateMcLean;
        private String fulfillmentChannel;
        private boolean isBusinessOrder;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderView {
        private String amazonOrderId;
        private Instant purchaseDateUtc;
        private ZonedDateTime purchaseDateMcLean;
        private String orderStatus;
        private String fulfillmentChannel;
        private boolean isBusinessOrder;
        private BigDecimal amount;
        private String currencyCode;
    }
}
