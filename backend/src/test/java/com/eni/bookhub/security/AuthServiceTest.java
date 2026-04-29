package com.eni.bookhub.security;

import com.eni.bookhub.bo.Account;
import com.eni.bookhub.bo.Role;
import com.eni.bookhub.controller.dto.response.AuthResponse;
import com.eni.bookhub.controller.dto.request.LoginRequest;
import com.eni.bookhub.controller.dto.request.RegisterRequest;
import com.eni.bookhub.repository.AccountRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("Tests du service d'authentification")
class AuthServiceTest {

    @Mock private AccountRepository repository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks private AuthService authService;

    private Account mockAccount;

    @BeforeEach
    void setUp() {
        mockAccount = Account.builder()
                .idAccount(1L)
                .nom("Doe").prenom("John").email("john.doe@example.com")
                .password("hashed_password").role(Role.USER)
                .build();
    }

    @Test
    @DisplayName("Inscription : Succès")
    void registerSucccessTest() {
        // Arrange
        RegisterRequest request = new RegisterRequest("Doe", "John", "john.doe@example.com", "0102030405", "password123");
        when(repository.findByEmail(request.email())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.password())).thenReturn("hashed_password");
        when(jwtService.generateToken(any(Account.class), eq(Role.USER.name()), anyLong())).thenReturn("mocked_token");

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals("mocked_token", response.token());
        verify(repository, times(1)).save(any(Account.class));
    }

    @Test
    @DisplayName("Inscription : Échec (Email déjà utilisé)")
    void registerFailTest() {
        // Arrange
        RegisterRequest request = new RegisterRequest("Doe", "John", "john.doe@example.com", "0102030405", "password123");
        when(repository.findByEmail(request.email())).thenReturn(Optional.of(mockAccount));

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> authService.register(request));
        assertEquals("Cet email est déjà utilisé.", ex.getMessage());
        verify(repository, never()).save(any(Account.class));
    }

    @Test
    @DisplayName("Connexion : Succès")
    void loginSuccessTest() {
        // Arrange
        LoginRequest request = new LoginRequest("john.doe@example.com", "password123");
        when(repository.findByEmail(request.email())).thenReturn(Optional.of(mockAccount));
        when(jwtService.generateToken(mockAccount, Role.USER.name(), anyLong())).thenReturn("mocked_token");

        // Act
        AuthResponse response = authService.login(request);

        // Assert
        assertNotNull(response);
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    @DisplayName("Connexion : Échec (Utilisateur inconnu)")
    void loginFailTest() {
        // Arrange
        LoginRequest request = new LoginRequest("unknown@example.com", "password123");
        when(repository.findByEmail(request.email())).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> authService.login(request));

        // Vérification que l'authentification a bien été tentée
        verify(authenticationManager, times(1)).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtService, never()).generateToken(any(Account.class), anyString(), anyLong());
    }
}