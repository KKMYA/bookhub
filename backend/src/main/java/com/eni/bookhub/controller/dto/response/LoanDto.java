package com.eni.bookhub.controller.dto.response;

import java.time.LocalDate;

public record LoanDto(

        Integer idEmprunt,

        LocalDate dateDebut,

        LocalDate dateRetourPrevue,

        LocalDate dateRetourEffective,

        String statut,

        Integer idBook,

        Integer idAccount,

        BookSumaryDto book
) {
}