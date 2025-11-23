package com.dsi.livry.delivery;

import com.dsi.livry.address.Address;
import com.dsi.livry.facture.FactureService;
import com.dsi.livry.station.Region;
import com.dsi.livry.station.Station;
import com.dsi.livry.user.User;
import com.dsi.livry.user.UserRole;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeliveryService {

    private final DeliveryRepository repository;
    private final FactureService factureService;

    public DeliveryService(DeliveryRepository repository, FactureService factureService) {
        this.repository = repository;
        this.factureService = factureService;
    }

    // Création livraison par client + facture automatique
    public Delivery createDelivery(Delivery delivery) {
        delivery.setStatus(DeliveryStatus.PENDING);
        delivery.setCreatedAt(LocalDateTime.now());

        Delivery saved = repository.save(delivery);

        // Création automatique de la facture
        double montant = 8.0;  // Prix fixe
        factureService.createFacture(montant, saved.getClient(), saved);

        return saved;
    }

    //Acceptation livraison par chauffeur
    public Delivery acceptDelivery(Long deliveryId, User driver) {
        Delivery delivery = getDeliveryById(deliveryId);
        if (delivery.getStatus() != DeliveryStatus.PENDING) {
            throw new RuntimeException("Livraison déjà acceptée ou livrée");
        }
        delivery.setDriver(driver);
        delivery.setStatus(DeliveryStatus.ACCEPTED);
        return repository.save(delivery);
    }

    //Mise à jour du statut par chauffeur
    public Delivery updateDeliveryStatus(Long deliveryId, DeliveryStatus status, User driver) {
        Delivery delivery = getDeliveryById(deliveryId);
        if (!driver.equals(delivery.getDriver())) {
            throw new RuntimeException("Seul le chauffeur assigné peut mettre à jour le statut");
        }
        delivery.setStatus(status);
        return repository.save(delivery);
    }

    //Transfert livraison par chauffeur vers station/dépôt
    public Delivery transferToStationByDriver(Long deliveryId, Station station, User driver) {
        Delivery delivery = getDeliveryById(deliveryId);

        if (!driver.equals(delivery.getDriver())) {
            throw new RuntimeException("Seul le chauffeur assigné peut transférer cette livraison");
        }

        delivery.setDriver(null); // chauffeur libéré après dépôt
        delivery.setStatus(DeliveryStatus.PENDING); //livraison en attente

        //Adresse de départ = station
        Address stationAddress = new Address();
        stationAddress.setStreet(station.getName());
        stationAddress.setCity(station.getRegion().name());
        stationAddress.setRegion(station.getRegion());
        delivery.setDepartureAddress(stationAddress);

        delivery.setStation(station);

        return repository.save(delivery);
    }

    //Assignation chauffeur par admin
    public Delivery assignDriver(Long deliveryId, User driver) {
        if (driver.getRole() != UserRole.DRIVER) {
            throw new RuntimeException("Utilisateur non chauffeur");
        }
        Delivery delivery = getDeliveryById(deliveryId);
        delivery.setDriver(driver);
        delivery.setStatus(DeliveryStatus.ACCEPTED);
        return repository.save(delivery);
    }

    //Récupération livraisons par chauffeur
    public List<Delivery> getDeliveriesByDriver(Long driverId) {
        return repository.findByDriver_Id(driverId);
    }

    //Récupération livraisons pending par région
    public List<Delivery> getPendingDeliveriesByRegion(Region region) {
        return repository.findByStatusAndDepartureAddress_Region(DeliveryStatus.PENDING, region);
    }

    //Récupération livraison par id
    public Delivery getDeliveryById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Livraison introuvable"));
    }

    //Livraisons non assignées >24h
    public List<Delivery> getUnassignedOlderThan24h() {
        LocalDateTime limit = LocalDateTime.now().minusHours(24);
        return repository.findByDriverIsNullAndCreatedAtBefore(limit);
    }

    //Historique client
    public List<Delivery> getClientDeliveries(Long clientId) {
        return repository.findByClientId(clientId);
    }
}
