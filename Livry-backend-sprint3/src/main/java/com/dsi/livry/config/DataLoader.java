package com.dsi.livry.config;

import com.dsi.livry.address.Address;
import com.dsi.livry.delivery.*;
import com.dsi.livry.facture.Facture;
import com.dsi.livry.facture.FactureRepository;
import com.dsi.livry.intervention.*;
import com.dsi.livry.problem.*;
import com.dsi.livry.station.Region;
import com.dsi.livry.station.Station;
import com.dsi.livry.station.StationRepository;
import com.dsi.livry.user.*;
import com.dsi.livry.vehicle.Vehicle;
import com.dsi.livry.vehicle.VehicleRepository;
import com.dsi.livry.vehicle.VehicleStatus;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final DeliveryRepository deliveryRepository;
    private final ProblemRepository problemRepository;
    private final InterventionRepository interventionRepository;
    private final FactureRepository factureRepository;
    private final StationRepository stationRepository;

    public DataLoader(UserRepository userRepository,
                      VehicleRepository vehicleRepository,
                      DeliveryRepository deliveryRepository,
                      ProblemRepository problemRepository,
                      InterventionRepository interventionRepository,
                      FactureRepository factureRepository,
                      StationRepository stationRepository) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.deliveryRepository = deliveryRepository;
        this.problemRepository = problemRepository;
        this.interventionRepository = interventionRepository;
        this.factureRepository = factureRepository;
        this.stationRepository = stationRepository;
    }

    @Override
    public void run(String... args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();


        //USERS
        User admin = new User("Admin", "Admin", "admin@livry.com", encoder.encode("admin123"), UserRole.ADMIN, null,
                new Address("12", "Rue Admin", "Tunis", Region.TUNIS, "1000"));
        admin.setLatitude(36.8065);
        admin.setLongitude(10.1815);

        User driver1 = new User("Driver", "A", "driverA@livry.com", encoder.encode("driver123"), UserRole.DRIVER, Region.TUNIS,
                new Address("12", "Rue D1", "Tunis", Region.TUNIS, "1001"));
        driver1.setLatitude(36.8065);
        driver1.setLongitude(10.1815);

        User driver2 = new User("Driver", "B", "driverB@livry.com", encoder.encode("driver123"), UserRole.DRIVER, Region.SFAX,
                new Address("12", "Rue D2", "Sfax", Region.SFAX, "3000"));
        driver2.setLatitude(34.7406);
        driver2.setLongitude(10.7603);

        User driver3 = new User("Driver", "C", "driverC@livry.com", encoder.encode("driver123"), UserRole.DRIVER, Region.NABEUL,
                new Address("12", "Rue D3", "Nabeul", Region.NABEUL, "8002"));
        driver3.setLatitude(36.4561);
        driver3.setLongitude(10.7376);

        User mechanic1 = new User("Mechanic", "A", "mechA@livry.com", encoder.encode("mech123"), UserRole.MECHANIC, Region.TUNIS,
                new Address("12", "Rue M1", "Tunis", Region.TUNIS, "1002"));
        mechanic1.setLatitude(36.8065);
        mechanic1.setLongitude(10.1815);

        User mechanic2 = new User("Mechanic", "B", "mechB@livry.com", encoder.encode("mech123"), UserRole.MECHANIC, Region.NABEUL,
                new Address("12", "Rue M2", "Nabeul", Region.NABEUL, "8001"));
        mechanic2.setLatitude(36.4561);
        mechanic2.setLongitude(10.7376);

        User client1 = new User("Client", "A", "clientA@gmail.com", encoder.encode("client123"), UserRole.CLIENT, null,
                new Address("12", "Rue C1", "Tunis", Region.TUNIS, "1003"));
        client1.setLatitude(36.8065);
        client1.setLongitude(10.1815);

        User client2 = new User("Client", "B", "clientB@gmail.com", encoder.encode("client123"), UserRole.CLIENT, null,
                new Address("12", "Rue C2", "Ariana", Region.ARIANA, "2080"));
        client2.setLatitude(36.8665);
        client2.setLongitude(10.1647);

        userRepository.saveAll(List.of(admin, driver1, driver2, driver3, mechanic1, mechanic2, client1, client2));

        //STATIONS
        Station s1 = new Station("Station Tunis", Region.TUNIS);
        Station s2 = new Station("Station Sfax", Region.SFAX);
        Station s3 = new Station("Station Nabeul", Region.NABEUL);

        stationRepository.saveAll(List.of(s1, s2, s3));

        driver1.setStation(s1);
        driver2.setStation(s2);
        driver3.setStation(s3);

        //VEHICLES
        Vehicle v1 = new Vehicle("Toyota", "Hilux", "100-TN-1111", VehicleStatus.AVAILABLE, driver1, s1);
        Vehicle v2 = new Vehicle("Fiat", "Doblo", "200-TN-2222", VehicleStatus.AVAILABLE, driver2, s2);
        Vehicle v3 = new Vehicle("Mercedes", "Sprinter", "300-TN-3333", VehicleStatus.AVAILABLE, null, s3);
        Vehicle v4 = new Vehicle("Renault", "Kangoo", "400-TN-4444", VehicleStatus.UNDER_REPAIR, null, s1);

        vehicleRepository.saveAll(List.of(v1, v2, v3, v4));

        //DELIVERIES
        Delivery d1 = new Delivery("COL-001", client1, driver1, s1,
                new Address("12", "Rue C1", "Tunis", Region.TUNIS, "1003"),
                new Address("12", "Rue D1", "Tunis", Region.TUNIS, "1001"),
                DeliveryType.DOCUMENT);
        d1.setCreatedAt(LocalDateTime.now().minusHours(26)); // plus de 24h

        Delivery d2 = new Delivery("COL-002", client2, driver2, s2,
                new Address("12", "Rue C2", "Ariana", Region.ARIANA, "2080"),
                new Address("12", "Rue D2", "Sfax", Region.SFAX, "3000"),
                DeliveryType.OTHER);

        Delivery d3 = new Delivery("COL-003", client1, driver1, s1,
                new Address("12", "Rue C1", "Tunis", Region.TUNIS, "1003"),
                new Address("12", "Rue D1", "Tunis", Region.TUNIS, "1001"),
                DeliveryType.FRAGILE);

        deliveryRepository.saveAll(List.of(d1, d2, d3));

        //FACTURES
        Facture f1 = new Facture(25.0, client1, d1);
        Facture f2 = new Facture(40.0, client2, d2);
        Facture f3 = new Facture(30.0, client1, d3);

        factureRepository.saveAll(List.of(f1, f2, f3));

        //PROBLEMS
        Problem p1 = new Problem(ProblemType.CLIENT_UNREACHABLE, "Client ne répond pas au téléphone", d1, driver1);
        Problem p2 = new Problem(ProblemType.ACCIDENT, "Accident mineur, véhicule en panne", d3, driver1);
        Problem p3 = new Problem(ProblemType.NON_DELIVERED, "Le client a donné une mauvaise adresse", d2, driver2);

        problemRepository.saveAll(List.of(p1, p2, p3));


        //INTERVENTIONS
        Intervention i1 = new Intervention(InterventionType.REPARATION, "Réparer le véhicule du driver", mechanic1, v1, s1);
        i1.setStatus(InterventionStatus.IN_PROGRESS);

        Intervention i2 = new Intervention(InterventionType.MAINTENANCE, "Maintenance du véhicule 200-TN-2222", mechanic2, v2, s2);

        Intervention i3 = new Intervention(InterventionType.INSPECTION, "Inspection véhicule non assigné", null, v3, s3);
        i3.setCreatedAt(LocalDateTime.now().minusHours(30)); 
        Intervention i4 = new Intervention(InterventionType.MAINTENANCE, "Maintenance véhicule en réparation", null, v4, s1);

        interventionRepository.saveAll(List.of(i1, i2, i3, i4));

        System.out.println("Data Loaded Successfully");
    }
}
