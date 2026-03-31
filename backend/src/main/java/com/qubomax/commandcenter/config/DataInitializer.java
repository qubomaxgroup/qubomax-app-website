package com.qubomax.commandcenter.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qubomax.commandcenter.spapi.model.AmazonOrdersResponse;
import com.qubomax.commandcenter.spapi.model.OrdersPayload;
import com.qubomax.commandcenter.spapi.service.OrdersService;
import java.io.InputStream;
import java.util.Objects;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final ObjectMapper objectMapper;
    private final OrdersService ordersService;

    @Bean
    CommandLineRunner loadMockDataOnStartup() {
        return args -> {
            try (InputStream inputStream = getClass().getResourceAsStream("/mock/sp-api-orders.sample.json")) {
                if (Objects.isNull(inputStream)) {
                    log.info("Mock SP-API file not found. Startup seeding skipped.");
                    return;
                }

                AmazonOrdersResponse response = objectMapper.readValue(inputStream, AmazonOrdersResponse.class);
                OrdersPayload payload = response.getPayload();
                if (payload == null || payload.getOrders() == null || payload.getOrders().isEmpty()) {
                    log.info("Mock SP-API file was empty. Startup seeding skipped.");
                    return;
                }

                ordersService.upsertOrderHistory(payload.getOrders());
                log.info("Loaded {} mock orders into order history.", payload.getOrders().size());
            } catch (Exception ex) {
                log.warn("Failed to seed mock order history: {}", ex.getMessage());
            }
        };
    }
}
