package com.dsi.livry.problem;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProblemRepository extends JpaRepository<Problem, Long> {
    List<Problem> findByStatus(ProblemStatus status);
    List<Problem> findByDeliveryId(Long deliveryId);
}
