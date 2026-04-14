package com.ssb.training.backend.controller;

import com.ssb.training.backend.entity.User;
import com.ssb.training.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }
        User savedUser = userRepository.save(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginData) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(loginData.getEmail());
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(loginData.getPassword())) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody User req) {
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(req.getEmail());
        if (userOpt.isPresent()) {
            return ResponseEntity.ok("Recovery email sent");
        }
        return ResponseEntity.status(404).body("This email is not registered");
    }
}
