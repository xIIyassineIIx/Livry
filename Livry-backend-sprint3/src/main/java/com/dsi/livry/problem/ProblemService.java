package com.dsi.livry.problem;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    public Problem reportProblem(Problem problem) {
        problem.setStatus(ProblemStatus.OPEN);
        return problemRepository.save(problem);
    }

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
    }

    public Problem updateStatus(Long id, ProblemStatus status) {
        Problem problem = getProblemById(id);
        problem.setStatus(status);
        return problemRepository.save(problem);
    }

    public List<Problem> getProblemsByDelivery(Long deliveryId) {
        return problemRepository.findByDeliveryId(deliveryId);
    }

    public List<Problem> getProblemsByStatus(ProblemStatus status) {
        return problemRepository.findByStatus(status);
    }
}
