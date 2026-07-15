package com.school.management.user.service;

import com.school.management.user.dto.LoginRequest;
import com.school.management.user.dto.RegisterRequest;
import com.school.management.user.dto.AuthResponse;

public interface UserService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

}