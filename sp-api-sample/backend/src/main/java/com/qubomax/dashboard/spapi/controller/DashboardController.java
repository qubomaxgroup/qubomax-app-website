package com.qubomax.dashboard.spapi.controller;

import com.qubomax.dashboard.spapi.dto.DailySummary;
import com.qubomax.dashboard.spapi.service.AmazonSpApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AmazonSpApiService amazonSpApiService;

    @GetMapping("/summary")
    public DailySummary getSummary() {
        return amazonSpApiService.getDailySummary();
    }
}
