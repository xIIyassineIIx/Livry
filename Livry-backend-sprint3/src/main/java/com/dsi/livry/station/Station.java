package com.dsi.livry.station;

import com.dsi.livry.user.User;
import com.dsi.livry.vehicle.Vehicle;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stations")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Station {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false)
    private Region region;

    @OneToMany(mappedBy = "station")
    @JsonIgnore
    private List<User> drivers = new ArrayList<>();

    @OneToMany(mappedBy = "station")
    @JsonIgnore
    private List<Vehicle> vehicles = new ArrayList<>();

    public Station() {}

    public Station(String name, Region region) {
        this.name = name;
        this.region = region;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
    public List<User> getDrivers() { return drivers; }
    public void setDrivers(List<User> drivers) { this.drivers = drivers; }
    public List<Vehicle> getVehicles() { return vehicles; }
    public void setVehicles(List<Vehicle> vehicles) { this.vehicles = vehicles; }
}
