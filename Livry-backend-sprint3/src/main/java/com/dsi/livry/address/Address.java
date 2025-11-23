package com.dsi.livry.address;

import com.dsi.livry.station.Region;
import jakarta.persistence.*;

@Entity
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String number;
    private String street;
    private String city;

    @Enumerated(EnumType.STRING)
    private Region region;

    private String postalCode;

    public Address() {}

    public Address(String number, String street, String city, Region region, String postalCode) {
        this.number = number;
        this.street = street;
        this.city = city;
        this.region = region;
        this.postalCode = postalCode;
    }

    public Long getId() { return id; }

    public String getNumber() { return number; }
    public void setNumber(String number) { this.number = number; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Region getRegion() { return region; }
    public void setRegion(Region region) { this.region = region; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

}
