package com.qubomax.commandcenter.spapi.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "order_history")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "amazon_order_id", nullable = false, unique = true, length = 40)
    private String amazonOrderId;

    @Column(name = "purchase_date_utc", nullable = false)
    private Instant purchaseDateUtc;

    @Column(name = "purchase_date_mclean")
    private Instant purchaseDateMcLean;

    @Column(name = "order_status", nullable = false, length = 40)
    private String orderStatus;

    @Column(name = "fulfillment_channel", length = 16)
    private String fulfillmentChannel;

    @Column(name = "marketplace_id", length = 32)
    private String marketplaceId;

    @Column(name = "currency_code", length = 8)
    private String currencyCode;

    @Column(name = "amount", precision = 19, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "is_business_order")
    private Boolean businessOrder;

    @Column(name = "recorded_at", nullable = false)
    private Instant fetchedAtUtc;
}
