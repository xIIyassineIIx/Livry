package com.dsi.livry.vehicle;

import com.dsi.livry.user.User;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public Vehicle addVehicle(Vehicle vehicle) {
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle assignToDriver(Long vehicleId, User driver) {
        Vehicle existingVehicle = vehicleRepository.findByDriver(driver);
        if (existingVehicle != null) {
            throw new RuntimeException("Ce chauffeur a déjà un véhicule assigné");
        }

        Vehicle vehicle = getVehicleById(vehicleId);
        vehicle.setDriver(driver);
        vehicle.setStatus(VehicleStatus.IN_USE);
        return vehicleRepository.save(vehicle);
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Véhicule introuvable"));
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle existing = getVehicleById(id);
        existing.setBrand(vehicleDetails.getBrand());
        existing.setModel(vehicleDetails.getModel());
        existing.setPlateNumber(vehicleDetails.getPlateNumber());
        return vehicleRepository.save(existing);
    }

    public Vehicle getVehicleByDriver(User driver) {
        return vehicleRepository.findByDriver(driver);
    }

    public long countByStatus(VehicleStatus status) {
        return vehicleRepository.countByStatus(status);
    }
}
