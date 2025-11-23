package com.dsi.livry.delivery;

import com.dsi.livry.station.Region;
import com.dsi.livry.station.Station;
import com.dsi.livry.station.StationRepository;
import com.dsi.livry.user.User;
import com.dsi.livry.user.UserRepository;
import com.dsi.livry.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@CrossOrigin(origins = "http://localhost:4200")
public class DeliveryController {

    private final DeliveryService service;
    private final UserRepository userRepository;
    private final StationRepository stationRepository;

    public DeliveryController(DeliveryService service, UserRepository userRepository, StationRepository stationRepository) {
        this.service = service;
        this.userRepository = userRepository;
        this.stationRepository = stationRepository;
    }

    //Création livraison (client)
    @PreAuthorize("hasRole('CLIENT')")
    @PostMapping("/client/{clientId}/create")
    public ResponseEntity<Delivery> create(@PathVariable Long clientId,
                                           @RequestBody Delivery delivery) {

        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client introuvable"));


        delivery.setClient(client);

        Delivery savedDelivery = service.createDelivery(delivery);
        return ResponseEntity.ok(savedDelivery);
    }


    //Acceptation livraison (chauffeur)
    @PreAuthorize("hasRole('DRIVER')")
    @PutMapping("/{deliveryId}/accept/{driverId}")
    public ResponseEntity<Delivery> accept(@PathVariable Long deliveryId,
                                           @PathVariable Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Chauffeur introuvable"));
        return ResponseEntity.ok(service.acceptDelivery(deliveryId, driver));
    }

    //Mise à jour statut (chauffeur)
    @PreAuthorize("hasRole('DRIVER')")
    @PutMapping("/{deliveryId}/status")
    public ResponseEntity<Delivery> updateStatus(@PathVariable Long deliveryId,
                                                 @RequestParam DeliveryStatus status,
                                                 @RequestParam Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Chauffeur introuvable"));
        return ResponseEntity.ok(service.updateDeliveryStatus(deliveryId, status, driver));
    }

    //Transfert livraison vers station par chauffeur
    @PreAuthorize("hasRole('DRIVER')")
    @PutMapping("/{deliveryId}/transfer-to-station/{stationId}")
    public ResponseEntity<Delivery> transferToStation(@PathVariable Long deliveryId,
                                                      @PathVariable Long stationId,
                                                      @RequestParam Long driverId) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Chauffeur introuvable"));

        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station introuvable"));

        return ResponseEntity.ok(service.transferToStationByDriver(deliveryId, station, driver));
    }

    //Liste livraisons chauffeur
    @PreAuthorize("hasRole('DRIVER')")
    @GetMapping("/driver/{driverId}/my")
    public ResponseEntity<List<Delivery>> getDriverDeliveries(@PathVariable Long driverId) {
        return ResponseEntity.ok(service.getDeliveriesByDriver(driverId));
    }

    //Liste livraisons pending par région
    @PreAuthorize("hasRole('DRIVER')")
    @GetMapping("/pending/{region}")
    public ResponseEntity<List<Delivery>> getPendingByRegion(@PathVariable String region) {
        Region enumRegion = Region.valueOf(region.toUpperCase());
        return ResponseEntity.ok(service.getPendingDeliveriesByRegion(enumRegion));
    }

    //Historique client
    @PreAuthorize("hasRole('CLIENT')")
    @GetMapping("/client/{clientId}/history")
    public ResponseEntity<List<Delivery>> getClientHistory(@PathVariable Long clientId) {
        return ResponseEntity.ok(service.getClientDeliveries(clientId));
    }

    //Livraisons non assignées >24h (admin)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/unassigned")
    public ResponseEntity<List<Delivery>> getUnassigned() {
        return ResponseEntity.ok(service.getUnassignedOlderThan24h());
    }
    //Assignation chauffeur par admin
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{deliveryId}/assign-driver/{driverId}")
    public ResponseEntity<Delivery> assignDriver(
            @PathVariable Long deliveryId,
            @PathVariable Long driverId) {

        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Chauffeur introuvable"));

        Delivery delivery = service.assignDriver(deliveryId, driver);
        return ResponseEntity.ok(delivery);
    }

}
