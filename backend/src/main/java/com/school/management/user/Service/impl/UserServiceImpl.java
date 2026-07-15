package com.school.management.user.service.impl;

import com.school.management.user.dto.AuthResponse;
import com.school.management.user.dto.LoginRequest;
import com.school.management.user.dto.RegisterRequest;
import com.school.management.user.entity.User;
import com.school.management.user.repository.UserRepository;
import com.school.management.user.service.UserService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists.");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists.");
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(request.getRole())
                .enabled(true)
                .build();

        userRepository.save(user);

        return AuthResponse.builder()
                .username(user.getUsername())
                .role(user.getRole().name())
                .message("User registered successfully.")
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password.");
        }

        return AuthResponse.builder()
                .username(user.getUsername())
                .role(user.getRole().name())
                .message("Login successful.")
                .build();
    }
}