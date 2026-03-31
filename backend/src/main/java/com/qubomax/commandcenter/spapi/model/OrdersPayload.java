package com.qubomax.commandcenter.spapi.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrdersPayload {

    @JsonProperty("Orders")
    private List<AmazonOrder> orders;

    @JsonProperty("NextToken")
    private String nextToken;
}
