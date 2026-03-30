package com.qubomax.dashboard.spapi.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AmazonOrder {

    @JsonProperty("AmazonOrderId")
    private String amazonOrderId;

    @JsonProperty("PurchaseDate")
    private Instant purchaseDate;

    @JsonProperty("LastUpdateDate")
    private Instant lastUpdateDate;

    @JsonProperty("OrderStatus")
    private String orderStatus;

    @JsonProperty("FulfillmentChannel")
    private String fulfillmentChannel;

    @JsonProperty("SalesChannel")
    private String salesChannel;

    @JsonProperty("ShipServiceLevel")
    private String shipServiceLevel;

    @JsonProperty("OrderTotal")
    private OrderTotal orderTotal;

    @JsonProperty("NumberOfItemsShipped")
    private Integer numberOfItemsShipped;

    @JsonProperty("NumberOfItemsUnshipped")
    private Integer numberOfItemsUnshipped;

    @JsonProperty("MarketplaceId")
    private String marketplaceId;

    @JsonProperty("ShipmentServiceLevelCategory")
    private String shipmentServiceLevelCategory;

    @JsonProperty("OrderType")
    private String orderType;

    @JsonProperty("EarliestShipDate")
    private Instant earliestShipDate;

    @JsonProperty("LatestShipDate")
    private Instant latestShipDate;

    @JsonProperty("EarliestDeliveryDate")
    private Instant earliestDeliveryDate;

    @JsonProperty("LatestDeliveryDate")
    private Instant latestDeliveryDate;

    @JsonProperty("IsBusinessOrder")
    private Boolean isBusinessOrder;

    @JsonProperty("IsPrime")
    private Boolean isPrime;

    @JsonProperty("IsPremiumOrder")
    private Boolean isPremiumOrder;

    @JsonProperty("IsGlobalExpressEnabled")
    private Boolean isGlobalExpressEnabled;

    @JsonProperty("IsReplacementOrder")
    private Boolean isReplacementOrder;

    @JsonProperty("IsSoldByAB")
    private Boolean isSoldByAB;
}
