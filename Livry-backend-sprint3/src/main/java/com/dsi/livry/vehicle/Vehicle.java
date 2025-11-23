package com.dsi.livry.vehicle;

import com.dsi.livry.user.User;
import com.dsi.livry.station.Station;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String brand;
    private String model;
    private String plateNumber;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    @JsonIgnoreProperties({"assignedDeliveries", "deliveries"})
    private User driver;

    @ManyToOne
    @JoinColumn(name = "station_id")
    @JsonIgnoreProperties({"drivers", "vehicles"})
    private Station station;

    public Vehicle() {}

    public Vehicle(String brand, String model, String plateNumber, VehicleStatus status, User driver, Station station) {
        this.brand = brand;
        this.model = model;
        this.plateNumber = plateNumber;
        this.status = status;
        this.driver = driver;
        this.station = station;
    }

    public Long getId() { return id; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }
    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }
    public User getDriver() { return driver; }
    public void setDriver(User driver) { this.driver = driver; }
    public Station getStation() { return station; }
    public void setStation(Station station) { this.station = station; }
}
