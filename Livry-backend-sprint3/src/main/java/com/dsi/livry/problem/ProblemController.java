package com.dsi.livry.problem;

import com.dsi.livry.delivery.DeliveryService;
import com.dsi.livry.user.User;
import com.dsi.livry.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "http://localhost:4200")
public class ProblemController {

    private final ProblemService problemService;
    private final DeliveryService deliveryService;
    private final UserService userService;

    public ProblemController(ProblemService problemService, DeliveryService deliveryService, UserService userService) {
        this.problemService = problemService;
        this.deliveryService = deliveryService;
        this.userService = userService;
    }

    //signaler problème CHAUFFEUR
    @PreAuthorize("hasRole('DRIVER')")
    @PostMapping("/driver")
    public ResponseEntity<Problem> reportProblemByDriver(@RequestParam Long driverId,
                                                         @RequestParam Long deliveryId,
                                                         @RequestParam ProblemType type,
                                                         @RequestParam String description) {
        User driver = userService.findById(driverId);
        if (type == ProblemType.NON_DELIVERED || type == ProblemType.DAMAGED_PACKAGE)
            throw new RuntimeException("Type de problème non autorisé pour le chauffeur");
        var delivery = deliveryService.getDeliveryById(deliveryId);
        Problem problem = new Problem(type, description, delivery, driver);
        return ResponseEntity.ok(problemService.reportProblem(problem));
    }

    //signaler problème CLIENT
    @PreAuthorize("hasRole('CLIENT')")
    @PostMapping("/client")
    public ResponseEntity<Problem> reportProblemByClient(@RequestParam Long clientId,
                                                         @RequestParam Long deliveryId,
                                                         @RequestParam ProblemType type,
                                                         @RequestParam String description) {
        User client = userService.findById(clientId);
        if (type == ProblemType.DELIVERY_DELAY || type == ProblemType.ACCIDENT || type == ProblemType.CLIENT_UNREACHABLE)
            throw new RuntimeException("Type de problème non autorisé pour le client");
        var delivery = deliveryService.getDeliveryById(deliveryId);
        Problem problem = new Problem(type, description, delivery, client);
        return ResponseEntity.ok(problemService.reportProblem(problem));
    }
    //voir problèmes ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<Problem>> getAllProblems() {
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    //traiter probleme (Admin)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/status")
    public ResponseEntity<Problem> updateProblemStatus(@PathVariable Long id,
                                                       @RequestParam ProblemStatus status) {
        return ResponseEntity.ok(problemService.updateStatus(id, status));
    }

    //voir reclamations par livraison
    @GetMapping("/delivery/{deliveryId}")
    public ResponseEntity<List<Problem>> getProblemsByDelivery(@PathVariable Long deliveryId) {
        return ResponseEntity.ok(problemService.getProblemsByDelivery(deliveryId));
    }

    //voir problèmes par statut
    @GetMapping("/status/{status}")
    public ResponseEntity<List<Problem>> getProblemsByStatus(@PathVariable ProblemStatus status) {
        return ResponseEntity.ok(problemService.getProblemsByStatus(status));
    }
}
