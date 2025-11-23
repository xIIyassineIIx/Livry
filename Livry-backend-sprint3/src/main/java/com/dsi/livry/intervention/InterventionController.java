package com.dsi.livry.intervention;

import com.dsi.livry.station.Station;
import com.dsi.livry.station.StationRepository;
import com.dsi.livry.user.User;
import com.dsi.livry.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/interventions")
@CrossOrigin(origins = "http://localhost:4200")
public class InterventionController {

    private final InterventionService service;
    private final UserService userService;
    private final StationRepository stationRepository;

    public InterventionController(InterventionService service, UserService userService, StationRepository stationRepository) {
        this.service = service;
        this.userService = userService;
        this.stationRepository = stationRepository;
    }

    //créer une intervention (admin)
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Intervention> create(@RequestBody Map<String, Object> body) {
        Long mechanicId = body.get("mechanicId") != null ? Long.valueOf(body.get("mechanicId").toString()) : null;
        Long stationId = Long.valueOf(body.get("stationId").toString());
        String description = body.get("description").toString();

        User mechanic = mechanicId != null ? userService.findById(mechanicId) : null;
        Station station = stationRepository.findById(stationId)
                .orElseThrow(() -> new RuntimeException("Station introuvable"));

        Intervention intervention = new Intervention();
        intervention.setDescriptionRequest(description);
        intervention.setStation(station);
        intervention.setMechanic(mechanic);

        return ResponseEntity.ok(service.createIntervention(intervention, mechanic));
    }

    //voir ses interventions (mécanicien)
    @PreAuthorize("hasRole('MECHANIC')")
    @GetMapping("/mechanic/{id}")
    public ResponseEntity<List<Intervention>> getForMechanic(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPendingForMechanic(id));
    }

    //cloturer une intervention (mécanicien)
    @PreAuthorize("hasRole('MECHANIC')")
    @PostMapping("/{id}/complete")
    public ResponseEntity<Intervention> complete(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String descriptionDone = body.get("description");
        return ResponseEntity.ok(service.complete(id, descriptionDone));
    }

    //interventions non assignées à un mécanicien (admin)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/unassigned")
    public ResponseEntity<List<Intervention>> getUnassigned() {
        return ResponseEntity.ok(service.getUnassigned());
    }

    //Assigner intervention à un mécanicien (admin)
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/assign/{mechanicId}")
    public ResponseEntity<Intervention> assignMechanic(@PathVariable Long id, @PathVariable Long mechanicId) {
        User mechanic = userService.findById(mechanicId);
        return ResponseEntity.ok(service.assignMechanic(id, mechanic));
    }
}
