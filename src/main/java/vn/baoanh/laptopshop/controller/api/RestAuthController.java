package vn.baoanh.laptopshop.controller.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import vn.baoanh.laptopshop.domain.User;
import vn.baoanh.laptopshop.domain.dto.RegisterDTO;
import vn.baoanh.laptopshop.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class RestAuthController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public RestAuthController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getName())) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
        User user = this.userService.getUserByEmail(authentication.getName());
        if (user == null) {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
        Map<String, Object> response = new HashMap<>();
        response.put("authenticated", true);
        response.put("id", user.getId());
        response.put("email", user.getEmail());
        response.put("fullName", user.getFullName());
        response.put("avatar", user.getAvatar());
        response.put("role", user.getRole().getName());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {
        if (this.userService.checkEmailExist(registerDTO.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }
        User user = this.userService.registerDTOtoUser(registerDTO);
        String hashPassword = this.passwordEncoder.encode(user.getPassword());
        user.setPassword(hashPassword);
        user.setRole(this.userService.getRoleByName("USER"));
        this.userService.handleSaveUser(user);
        return ResponseEntity.ok(Map.of("success", true, "message", "User registered successfully"));
    }
}
