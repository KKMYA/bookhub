package com.eni.bookhub.controller.dto.response;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Builder;

@Builder
@Schema(description = "Data Transfer Object representing book object.")
public record BookDtoResponse(

        Integer idBook,
        String titre,
        String auteur,
        String isbn,
        Double noteMoyenne,
        String description,
        String couvertureUrl,
        Integer nbExemplaires,
        Integer nbExemplairesDisponibles,
        String categoryLibelle
) {
}
