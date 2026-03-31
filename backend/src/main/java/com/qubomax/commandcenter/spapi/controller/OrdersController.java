package com.qubomax.commandcenter.spapi.controller;

import com.qubomax.commandcenter.spapi.dto.DailySummaryDTO;
import com.qubomax.commandcenter.spapi.service.OrdersService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrdersController {

    private final OrdersService ordersService;

    @GetMapping("/daily-summary")
    public ResponseEntity<DailySummaryDTO> getDailySummary(
            @RequestParam(name = "marketplaceId", required = false) String marketplaceId
    ) {
        return ResponseEntity.ok(ordersService.getDailySummary(marketplaceId));
    }
}
