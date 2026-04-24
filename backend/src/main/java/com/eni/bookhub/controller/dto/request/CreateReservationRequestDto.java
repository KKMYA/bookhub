package com.eni.bookhub.controller.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record CreateReservationRequestDto(
        LocalDate dateReservation,

        Integer rangFileAttente,

        @Pattern(regexp = "CANCELLED|AVAILABLE|PENDING", message = "statut doit etre CANCELLED, AVAILABLE ou PENDING")
        String statut,

        @NotNull(message = "idBook est obligatoire")
        Integer idBook
) {
}
