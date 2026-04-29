package com.eni.bookhub.controller.dto.request;

import jakarta.validation.constraints.NotBlank;

public record UpdateReservationStatusRequestDto(
        @NotBlank(message = "Le statut est obligatoire")
        String statut
) {
}
