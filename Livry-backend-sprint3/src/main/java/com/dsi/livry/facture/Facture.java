package com.dsi.livry.facture;

import com.dsi.livry.delivery.Delivery;
import com.dsi.livry.user.User;
import jakarta.persistence.*;

@Entity
public class Facture {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String reference;
    private double montant;

    @ManyToOne
    private User client;

    @OneToOne
    private Delivery delivery;

    public Facture() {}
    public Facture(double montant, User client, Delivery delivery) {
        this.montant = montant;
        this.client = client;
        this.delivery = delivery;
    }

    @PostPersist
    public void setReferenceAfterPersist() {
        this.reference = "FAC-" + this.id;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public double getMontant() {
        return montant;
    }

    public void setMontant(double montant) {
        this.montant = montant;
    }

    public User getClient() {
        return client;
    }

    public void setClient(User client) {
        this.client = client;
    }

    public Delivery getDelivery() {
        return delivery;
    }

    public void setDelivery(Delivery delivery) {
        this.delivery = delivery;
    }
}
