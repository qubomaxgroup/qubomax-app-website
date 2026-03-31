package com.qubomax.commandcenter.spapi.repository;

import com.qubomax.commandcenter.spapi.entity.OrderHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderHistoryRepository extends JpaRepository<OrderHistoryEntity, Long> {

    Optional<OrderHistoryEntity> findByAmazonOrderId(String amazonOrderId);
}
