package com.dsi.livry.delivery;

import com.dsi.livry.station.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    List<Delivery> findByStatus(DeliveryStatus status);
    long countByStatus(DeliveryStatus status);
    List<Delivery> findByStatusAndDepartureAddress_Region(DeliveryStatus status, Region region);
    List<Delivery> findByClientId(Long clientId);
    List<Delivery> findByDriver_Id(Long driverId);
    List<Delivery> findByDriverIsNullAndCreatedAtBefore(LocalDateTime dateTime);
}
