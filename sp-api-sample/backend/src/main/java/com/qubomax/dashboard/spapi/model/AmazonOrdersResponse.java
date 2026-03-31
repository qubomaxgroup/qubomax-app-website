package com.qubomax.dashboard.spapi.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AmazonOrdersResponse {

    @JsonProperty("payload")
    private OrdersPayload payload;
}
