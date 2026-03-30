package com.qubomax.dashboard.spapi.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderTotal {

    @JsonProperty("CurrencyCode")
    private String currencyCode;

    @JsonProperty("Amount")
    private BigDecimal amount;
}
