package com.eni.bookhub.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Email obligatoire")
        @Email(message = "Format de l'email invalide")
        String email,

        @NotBlank(message = "Mot de passe est obligatoire")
        String password
) {
}
