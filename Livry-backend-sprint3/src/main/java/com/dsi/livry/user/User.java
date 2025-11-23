package com.dsi.livry.user;

import com.dsi.livry.address.Address;
import com.dsi.livry.delivery.Delivery;
import com.dsi.livry.station.Region;
import com.dsi.livry.station.Station;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private Region region;

    @OneToOne(cascade = CascadeType.ALL)
    private Address address;

    private Double longitude;
    private Double latitude;

    @ManyToOne
    private Station station;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Delivery> deliveries = new ArrayList<>();

    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Delivery> assignedDeliveries = new ArrayList<>();

    public User() {}

    public User(String firstName, String lastName, String email, String password, UserRole role, Region region, Address address) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
        this.region = region;
        this.address = address;
    }

    public Long getId() { return id; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }
    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }
    public Station getStation() { return station; }
    public void setStation(Station station) { this.station = station; }
    public List<Delivery> getDeliveries() { return deliveries; }
    public void setDeliveries(List<Delivery> deliveries) { this.deliveries = deliveries; }
    public List<Delivery> getAssignedDeliveries() { return assignedDeliveries; }
    public void setAssignedDeliveries(List<Delivery> assignedDeliveries) { this.assignedDeliveries = assignedDeliveries; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
}
