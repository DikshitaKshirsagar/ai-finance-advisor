package com.financeadvisor.backend.service;

import com.financeadvisor.backend.dto.AuthResponse;
import com.financeadvisor.backend.dto.LoginRequest;
import com.financeadvisor.backend.dto.RegisterRequest;
import com.financeadvisor.backend.entity.User;
import com.financeadvisor.backend.repository.UserRepository;
import com.financeadvisor.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());

        User savedUser = userRepository.save(user);

        String token = jwtUtil.generateToken(savedUser.getEmail());

        return new AuthResponse(
                "User registered successfully",
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                token
        );
    }

    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                "Login successful",
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                token
        );
    }
}