package com.eni.bookhub.controller.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;


@Builder
@Schema(description = "Data Transfer Object representing the search for book.")
public record BookSearchDto(

        String auteur,
        String titre,
        String categoryLibelle,
        Integer nbExemplairesDisponibles
) {
}
