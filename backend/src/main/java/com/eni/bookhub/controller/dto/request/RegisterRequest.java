package com.eni.bookhub.controller.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RegisterRequest(
        @NotBlank(message = "Email est obligatoire")
        @Email(message = "Format de l'email invalide")
        String email,

        @NotBlank(message = "Mot de passe est obligatoire")
        @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!.*]).{12,}$",
                message = "Le mot de passe doit contenir au moins 12 caractères, avec une majuscule, une minuscule, un chiffre et un caractère spécial")
        String password,

        @NotBlank(message = "Prénom obligatoire")
        String prenom,

        @NotBlank(message = "Nom obligatoire")
        String nom,

        String telephone
) {
}
