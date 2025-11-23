package com.dsi.livry.user;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ADMIN
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.findById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/role")
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestParam UserRole role) {
        return ResponseEntity.ok(userService.updateUserRole(id, role));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add-admin")
    public ResponseEntity<?> addAdmin(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.registerAdmin(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add-chauffeur")
    public ResponseEntity<?> addChauffeur(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.registerChauffeur(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add-mecanicien")
    public ResponseEntity<?> addMecanicien(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.registerMecanicien(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUBLIC
    @PostMapping("/register")
    public ResponseEntity<?> registerClient(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.registerClient(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User existingUser = userService.getByEmail(user.getEmail());
            String token = userService.loginAndGetToken(user.getEmail(), user.getPassword());

            Map<String, Object> response = new java.util.HashMap<>();
            response.put("token", token);
            response.put("email", existingUser.getEmail());
            response.put("userId", existingUser.getId());
            response.put("role", existingUser.getRole());
            response.put("region", existingUser.getRegion() != null ? existingUser.getRegion().name() : null);
            response.put("firstName", existingUser.getFirstName());
            response.put("lastName", existingUser.getLastName());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
