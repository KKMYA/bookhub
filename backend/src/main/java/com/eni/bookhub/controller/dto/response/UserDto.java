package com.eni.bookhub.controller.dto.response;

public record UserDto(
        Long id,
        String nom,
        String prenom,
        String email,
        String telephone
) {
}
