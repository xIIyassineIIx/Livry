package com.dsi.livry.user;

import com.dsi.livry.address.Address;
import com.dsi.livry.security.CustomUserDetails;
import com.dsi.livry.security.JwtService;
import com.dsi.livry.station.Region;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Cet email est déjà utilisé !");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // Create Address if not provided but region is available
        if (user.getAddress() == null && user.getRegion() != null) {
            Address address = new Address();
            address.setStreet(user.getRegion().name() + " Street");
            address.setCity(user.getRegion().name());
            address.setRegion(user.getRegion());
            address.setPostalCode("0000");
            user.setAddress(address);
        }
        
        // If coordinates are not provided, try to geocode from address/region
        if (user.getLatitude() == null || user.getLongitude() == null) {
            geocodeUserAddress(user);
        }
        
        return userRepository.save(user);
    }

    private void geocodeUserAddress(User user) {
        // Simple geocoding based on region (fallback)
        // In production, you might want to use a proper geocoding service
        if (user.getRegion() != null) {
            switch (user.getRegion()) {
                case TUNIS:
                    user.setLatitude(36.8065);
                    user.setLongitude(10.1815);
                    break;
                case ARIANA:
                    user.setLatitude(36.8665);
                    user.setLongitude(10.1647);
                    break;
                case BEN_AROUS:
                    user.setLatitude(36.7531);
                    user.setLongitude(10.2194);
                    break;
                case MANOUBA:
                    user.setLatitude(36.8080);
                    user.setLongitude(10.0972);
                    break;
                case SFAX:
                    user.setLatitude(34.7406);
                    user.setLongitude(10.7603);
                    break;
                case SOUSSE:
                    user.setLatitude(35.8254);
                    user.setLongitude(10.6369);
                    break;
                case NABEUL:
                    user.setLatitude(36.4561);
                    user.setLongitude(10.7376);
                    break;
                default:
                    user.setLatitude(36.8065);
                    user.setLongitude(10.1815);
                    break;
            }
        } else {
            // Default to Tunis if no region
            user.setLatitude(36.8065);
            user.setLongitude(10.1815);
        }
    }

    public User registerClient(User user) {
        user.setRole(UserRole.CLIENT);
        return register(user);
    }

    public User registerAdmin(User user) {
        user.setRole(UserRole.ADMIN);
        return register(user);
    }

    public User registerChauffeur(User user) {
        user.setRole(UserRole.DRIVER);
        return register(user);
    }

    public User registerMecanicien(User user) {
        user.setRole(UserRole.MECHANIC);
        return register(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));
    }

    public String loginAndGetToken(String email, String password) {
        User user = getByEmail(email);
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect");
        }
        return jwtService.generateToken(new CustomUserDetails(user));
    }

    public User updateUserRole(Long userId, UserRole role) {
        User user = findById(userId);
        user.setRole(role);
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("Utilisateur introuvable");
        }
        userRepository.deleteById(userId);
    }
}
