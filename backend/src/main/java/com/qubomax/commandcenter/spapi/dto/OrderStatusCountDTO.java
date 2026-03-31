package com.qubomax.commandcenter.spapi.dto;

public record OrderStatusCountDTO(
        long pending,
        long unshipped,
        long shipped
) {
}
