package com.dsi.livry.problem;

import com.dsi.livry.delivery.Delivery;
import com.dsi.livry.user.User;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "problems")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private ProblemType type;

    private String description;

    @Enumerated(EnumType.STRING)
    private ProblemStatus status = ProblemStatus.OPEN;

    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JsonIgnoreProperties({"deliveries", "driver", "station"})
    private Delivery delivery;

    @ManyToOne
    @JsonIgnoreProperties({"deliveries", "vehicles", "station"})
    private User createdBy; // chauffeur ou client

    public Problem() {}

    public Problem(ProblemType type, String description, Delivery delivery, User createdBy) {
        this.type = type;
        this.description = description;
        this.delivery = delivery;
        this.createdBy = createdBy;
        this.status = ProblemStatus.OPEN;
    }


    public Long getId() { return id; }
    public ProblemType getType() { return type; }
    public void setType(ProblemType type) { this.type = type; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public ProblemStatus getStatus() { return status; }
    public void setStatus(ProblemStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Delivery getDelivery() { return delivery; }
    public void setDelivery(Delivery delivery) { this.delivery = delivery; }
    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
}
