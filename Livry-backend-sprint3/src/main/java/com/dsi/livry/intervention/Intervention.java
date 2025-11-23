package com.dsi.livry.intervention;

import com.dsi.livry.user.User;
import com.dsi.livry.vehicle.Vehicle;
import com.dsi.livry.station.Station;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "interventions")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Intervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private InterventionType type;

    private String descriptionRequest;
    private String descriptionDone;

    @Enumerated(EnumType.STRING)
    private InterventionStatus status;

    private LocalDateTime createdAt;
    private LocalDate completionDate;

    @ManyToOne
    @JsonIgnoreProperties({"interventions"})
    private User mechanic;

    @ManyToOne
    @JsonIgnoreProperties({"interventions"})
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "station_id")
    @JsonIgnoreProperties({"interventions"})
    private Station station;

    public Intervention() {
        this.createdAt = LocalDateTime.now();
        this.status = InterventionStatus.PENDING;
    }

    public Intervention(InterventionType type, String descriptionRequest, User mechanic, Vehicle vehicle, Station station) {
        this.type = type;
        this.descriptionRequest = descriptionRequest;
        this.mechanic = mechanic;
        this.vehicle = vehicle;
        this.station = station;
        this.createdAt = LocalDateTime.now();
        this.status = InterventionStatus.PENDING;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public InterventionType getType() { return type; }
    public void setType(InterventionType type) { this.type = type; }
    public String getDescriptionRequest() { return descriptionRequest; }
    public void setDescriptionRequest(String descriptionRequest) { this.descriptionRequest = descriptionRequest; }
    public String getDescriptionDone() { return descriptionDone; }
    public void setDescriptionDone(String descriptionDone) { this.descriptionDone = descriptionDone; }
    public InterventionStatus getStatus() { return status; }
    public void setStatus(InterventionStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDate getCompletionDate() { return completionDate; }
    public void setCompletionDate(LocalDate completionDate) { this.completionDate = completionDate; }
    public User getMechanic() { return mechanic; }
    public void setMechanic(User mechanic) { this.mechanic = mechanic; }
    public Vehicle getVehicle() { return vehicle; }
    public void setVehicle(Vehicle vehicle) { this.vehicle = vehicle; }
    public Station getStation() { return station; }
    public void setStation(Station station) { this.station = station; }
}
