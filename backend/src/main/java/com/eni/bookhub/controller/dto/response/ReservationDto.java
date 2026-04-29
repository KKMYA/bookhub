package com.eni.bookhub.controller.dto.response;

import java.time.LocalDate;

public record ReservationDto(
        Long idReservation,
        LocalDate dateReservation,
        Integer rangFileAttente,
        String statut,
        Integer idBook,
        Long idAccount,
        BookSumaryDto book
) {
}
