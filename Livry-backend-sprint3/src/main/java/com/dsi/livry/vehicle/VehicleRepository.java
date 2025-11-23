package com.dsi.livry.vehicle;

import com.dsi.livry.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    Vehicle findByDriver(User driver);

    List<Vehicle> findByDriverIsNull();

    boolean existsByDriver(User driver);

    long countByStatus(VehicleStatus status);
}
