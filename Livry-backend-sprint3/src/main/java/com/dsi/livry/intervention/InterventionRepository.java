package com.dsi.livry.intervention;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterventionRepository extends JpaRepository<Intervention, Long> {
    List<Intervention> findByMechanicIdAndStatusNot(Long mechanicId, InterventionStatus status);
    long countByStatus(InterventionStatus status);
    List<Intervention> findByMechanicIsNull();
}
