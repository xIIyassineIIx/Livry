package com.dsi.livry.facture;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/factures")
@CrossOrigin(origins = "http://localhost:4200")
public class FactureController {

    private final FactureService factureService;

    public FactureController(FactureService factureService) {
        this.factureService = factureService;
    }

    //Toutes les factures d'un client
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Facture>> getFacturesByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(factureService.getFacturesByClient(clientId));
    }

    //Facture d'une livraison
    @GetMapping("/delivery/{deliveryId}")
    public ResponseEntity<Facture> getFactureByDelivery(@PathVariable Long deliveryId) {
        return ResponseEntity.ok(factureService.getFactureByDelivery(deliveryId));
    }
}
