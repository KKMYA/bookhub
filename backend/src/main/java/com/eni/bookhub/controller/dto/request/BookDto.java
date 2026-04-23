package com.eni.bookhub.controller.dto.request;


import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "Data Transfer Object representing book object.")
public record BookDto(
    String titre,

    String auteur,

    String isbn,

    Double noteMoyenne,

    String description,

    String couvertureUrl,

    Integer nbExemplaires,

    Integer nbExemplairesDisponibles,

    String categoryLibelle
) {}
