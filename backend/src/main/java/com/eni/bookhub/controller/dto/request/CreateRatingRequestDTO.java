package com.eni.bookhub.controller.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateRatingRequestDTO(
        @NotNull
        @Min(value = 1, message = "La note doit être comprise entre 1 et 5.")
        @Max(value = 5, message = "La note doit être comprise entre 1 et 5.")
        Integer note,

        @Size(max = 1000, message = "Le commentaire ne peut pas dépasser 1000 caractères.")
        String commentaire) {
}
