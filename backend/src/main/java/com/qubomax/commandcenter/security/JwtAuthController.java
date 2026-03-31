package com.qubomax.commandcenter.security;

import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Validated
public class JwtAuthController {

    private final JwtService jwtService;

    @Value("${app.auth.internal.username}")
    private String configuredUsername;

    @Value("${app.auth.internal.password}")
    private String configuredPassword;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        if (!configuredUsername.equals(request.username()) || !configuredPassword.equals(request.password())) {
            return ResponseEntity.status(401).build();
        }
        String token = jwtService.generateToken(request.username());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
