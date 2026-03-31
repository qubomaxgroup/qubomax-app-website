package com.qubomax.commandcenter.spapi.model;

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

    @JsonProperty("OrderStatus")
    private String orderStatus;

    @JsonProperty("MarketplaceId")
    private String marketplaceId;

    @JsonProperty("FulfillmentChannel")
    private String fulfillmentChannel;

    @JsonProperty("OrderTotal")
    private OrderTotal orderTotal;
}
