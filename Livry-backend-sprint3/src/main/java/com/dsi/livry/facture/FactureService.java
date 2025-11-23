package com.dsi.livry.facture;

import com.dsi.livry.delivery.Delivery;
import com.dsi.livry.user.User;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FactureService {

    private final FactureRepository factureRepository;

    public FactureService(FactureRepository factureRepository) {
        this.factureRepository = factureRepository;
    }


    public Facture createFacture(double montant, User client, Delivery delivery) {
        Facture facture = new Facture(montant, client, delivery);
        return factureRepository.save(facture);
    }

    public List<Facture> getFacturesByClient(Long clientId) {
        return factureRepository.findByClientId(clientId);
    }

    public Facture getFactureByDelivery(Long deliveryId) {
        return factureRepository.findByDeliveryId(deliveryId);
    }
}
