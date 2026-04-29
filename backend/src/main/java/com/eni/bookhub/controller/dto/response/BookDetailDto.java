package com.eni.bookhub.controller.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "Data Transfer Object representing the details book.")
public record BookDetailDto(

        String titre,

        String auteur,

        Double noteMoyenne,

        String description,

        String couvertureUrl,

        Integer nbExemplairesDisponibles,

        // le libellé pour la catégorie
        String categoryLibelle,

        Boolean hasActiveReservation,

        String isbn

) {
}