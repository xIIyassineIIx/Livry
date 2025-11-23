package com.dsi.livry.dashboard;

import com.dsi.livry.delivery.DeliveryRepository;
import com.dsi.livry.delivery.DeliveryStatus;
import com.dsi.livry.problem.ProblemRepository;
import com.dsi.livry.user.UserRepository;
import com.dsi.livry.user.UserRole;
import com.dsi.livry.vehicle.VehicleRepository;
import com.dsi.livry.vehicle.VehicleStatus;
import com.dsi.livry.intervention.InterventionRepository;
import com.dsi.livry.station.StationRepository;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final DeliveryRepository deliveryRepository;
    private final VehicleRepository vehicleRepository;
    private final ProblemRepository problemRepository;
    private final InterventionRepository interventionRepository;
    private final StationRepository stationRepository;

    public DashboardService(UserRepository userRepository,
                            DeliveryRepository deliveryRepository,
                            VehicleRepository vehicleRepository,
                            ProblemRepository problemRepository,
                            InterventionRepository interventionRepository,
                            StationRepository stationRepository) {
        this.userRepository = userRepository;
        this.deliveryRepository = deliveryRepository;
        this.vehicleRepository = vehicleRepository;
        this.problemRepository = problemRepository;
        this.interventionRepository = interventionRepository;
        this.stationRepository = stationRepository;
    }

    public DashboardDTO getDashboard() {
        DashboardDTO dto = new DashboardDTO();

        // Users
        dto.setTotalClients(userRepository.countByRole(UserRole.CLIENT));
        dto.setTotalDrivers(userRepository.countByRole(UserRole.DRIVER));
        dto.setTotalMechanics(userRepository.countByRole(UserRole.MECHANIC));
        dto.setTotalAdmins(userRepository.countByRole(UserRole.ADMIN));

        // Deliveries
        dto.setTotalDeliveries(deliveryRepository.count());
        dto.setDelivered(deliveryRepository.countByStatus(DeliveryStatus.DELIVERED));
        dto.setPending(deliveryRepository.countByStatus(DeliveryStatus.PENDING));
        dto.setOngoingDeliveries(deliveryRepository.countByStatus(DeliveryStatus.ACCEPTED));
        dto.setDeliveriesInTransfer(deliveryRepository.countByStatus(DeliveryStatus.DRIVER_TRANSFER));

        // Vehicles
        long totalVehicles = vehicleRepository.count();
        long available = vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
        long busy = vehicleRepository.countByStatus(VehicleStatus.IN_USE);

        dto.setTotalVehicles(totalVehicles);
        dto.setAvailableVehicles(available);
        dto.setBusyVehicles(busy);
        dto.setPercentageVehiclesBusy(totalVehicles > 0 ? (busy * 100.0 / totalVehicles) : 0);

        // Problems & Interventions
        dto.setTotalProblems(problemRepository.count());
        dto.setTotalInterventions(interventionRepository.count());

        // Stations
        dto.setTotalStations(stationRepository.count());

        return dto;
    }
}
