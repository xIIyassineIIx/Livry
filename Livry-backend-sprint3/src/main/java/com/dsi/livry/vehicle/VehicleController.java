package com.dsi.livry.vehicle;

import com.dsi.livry.user.User;
import com.dsi.livry.user.UserRepository;
import com.dsi.livry.user.UserRole;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/vehicles")
@CrossOrigin(origins = "http://localhost:4200")
public class VehicleController {

    private final VehicleService vehicleService;
    private final UserRepository userRepository;

    public VehicleController(VehicleService vehicleService, UserRepository userRepository) {
        this.vehicleService = vehicleService;
        this.userRepository = userRepository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public Vehicle addVehicle(@RequestBody Vehicle vehicle) {
        return vehicleService.addVehicle(vehicle);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{vehicleId}/assign/{driverId}")
    public Vehicle assignVehicle(@PathVariable Long vehicleId, @PathVariable Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Chauffeur introuvable"));
        if(driver.getRole() != UserRole.DRIVER) throw new RuntimeException("L'utilisateur n'est pas un chauffeur");
        return vehicleService.assignToDriver(vehicleId, driver);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<Vehicle> getVehicles() {
        return vehicleService.getAllVehicles();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{vehicleId}")
    public Vehicle updateVehicle(@PathVariable Long vehicleId, @RequestBody Vehicle vehicle) {
        return vehicleService.updateVehicle(vehicleId, vehicle);
    }
}
