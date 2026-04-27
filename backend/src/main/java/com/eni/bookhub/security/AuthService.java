package com.eni.bookhub.security;

import com.eni.bookhub.bo.Account;
import com.eni.bookhub.bo.Role;
import com.eni.bookhub.dto.AuthResponse;
import com.eni.bookhub.dto.LoginRequest;
import com.eni.bookhub.dto.RegisterRequest;
import com.eni.bookhub.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Vérification de si l'email existe déjà
        if (repository.findByEmail(request.email()).isPresent()) {
            throw new RuntimeException("Cet email est déjà utilisé.");
        }

        var account = Account.builder()
                .nom(request.nom())
                .prenom(request.prenom())
                .email(request.email())
                .telephone(request.telephone())
                .password(passwordEncoder.encode(request.password())) // Hachage du pawwsord BCrypt
                .role(Role.USER) // Rôle par défaut??
                .build();

        repository.save(account);

        var jwtToken = jwtService.generateToken(account, account.getRole().name());
        return new AuthResponse(jwtToken);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        var account = repository.findByEmail(request.email())
                .orElseThrow();

        var jwtToken = jwtService.generateToken(account, account.getRole().name());
        return new AuthResponse(jwtToken);
    }
}
