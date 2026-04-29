package com.eni.bookhub.controller.dto.request;

public record RegisterRequestByAdmin(
        String nom,
        String prenom,
        String email,
        String telephone,
        String password,
        String role
) {
}
