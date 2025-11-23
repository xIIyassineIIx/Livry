package com.dsi.livry.intervention;

import com.dsi.livry.user.User;
import com.dsi.livry.user.UserRole;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class InterventionService {

    private final InterventionRepository repository;

    public InterventionService(InterventionRepository repository) {
        this.repository = repository;
    }

    public Intervention createIntervention(Intervention intervention, User mechanic) {
        if(mechanic != null && mechanic.getRole() != UserRole.MECHANIC)
            throw new RuntimeException("Utilisateur non mécanicien");

        if(mechanic != null) {
            intervention.setMechanic(mechanic);
            intervention.setStatus(InterventionStatus.IN_PROGRESS);
        } else {
            intervention.setStatus(InterventionStatus.PENDING);
        }

        intervention.setCreatedAt(LocalDateTime.now());
        return repository.save(intervention);
    }

    public List<Intervention> getPendingForMechanic(Long mechanicId) {
        return repository.findByMechanicIdAndStatusNot(mechanicId, InterventionStatus.COMPLETED);
    }

    public Intervention complete(Long id, String descriptionDone) {
        Intervention i = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention introuvable"));
        i.setDescriptionDone(descriptionDone);
        i.setStatus(InterventionStatus.COMPLETED);
        i.setCompletionDate(LocalDate.now());
        return repository.save(i);
    }

    public List<Intervention> getUnassigned() {
        return repository.findByMechanicIsNull();
    }

    public Intervention assignMechanic(Long interventionId, User mechanic) {
        if(mechanic.getRole() != UserRole.MECHANIC)
            throw new RuntimeException("Utilisateur non mécanicien");

        Intervention i = repository.findById(interventionId)
                .orElseThrow(() -> new RuntimeException("Intervention introuvable"));
        i.setMechanic(mechanic);
        i.setStatus(InterventionStatus.IN_PROGRESS);
        return repository.save(i);
    }

    public Intervention getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention introuvable"));
    }
}
