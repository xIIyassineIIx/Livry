package com.dsi.livry.delivery;

import com.dsi.livry.address.Address;
import com.dsi.livry.station.Station;
import com.dsi.livry.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "deliveries")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Delivery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status = DeliveryStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "client_id")
    @JsonIgnoreProperties({"deliveries", "assignedDeliveries"})
    private User client;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    @JsonIgnoreProperties({"deliveries", "assignedDeliveries"})
    private User driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "station_id")
    @JsonIgnoreProperties({"drivers", "vehicles"})
    private Station station;

    @ManyToOne(cascade = CascadeType.ALL)
    private Address departureAddress;

    @ManyToOne(cascade = CascadeType.ALL)
    private Address arrivalAddress;

    @Enumerated(EnumType.STRING)
    private DeliveryType type;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Delivery() {}

    public Delivery(String description, User client, User driver, Station station,
                    Address departureAddress, Address arrivalAddress, DeliveryType type) {
        this.description = description;
        this.client = client;
        this.driver = driver;
        this.station = station;
        this.departureAddress = departureAddress;
        this.arrivalAddress = arrivalAddress;
        this.type = type;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public DeliveryStatus getStatus() { return status; }
    public void setStatus(DeliveryStatus status) { this.status = status; }
    public User getClient() { return client; }
    public void setClient(User client) { this.client = client; }
    public User getDriver() { return driver; }
    public void setDriver(User driver) { this.driver = driver; }
    public Station getStation() { return station; }
    public void setStation(Station station) { this.station = station; }
    public Address getDepartureAddress() { return departureAddress; }
    public void setDepartureAddress(Address departureAddress) { this.departureAddress = departureAddress; }
    public Address getArrivalAddress() { return arrivalAddress; }
    public void setArrivalAddress(Address arrivalAddress) { this.arrivalAddress = arrivalAddress; }
    public DeliveryType getType() { return type; }
    public void setType(DeliveryType type) { this.type = type; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
