package com.eni.bookhub.controller.dto.response;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record BookDto(

        Integer idBook,

        String titre,

        String auteur,

        String isbn,

        Double noteMoyenne,

        String description,

        String couvertureUrl,

        Integer nbExemplaires,

        Integer nbExemplairesDisponibles,

        // le libellé pour la catégorie
        String categoryLibelle
) {
}