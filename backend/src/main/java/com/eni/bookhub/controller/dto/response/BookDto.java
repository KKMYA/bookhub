package com.eni.bookhub.controller.dto.response;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public record BookDto (

    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 150)
    String titre,

    @NotBlank(message = "L''auteur est obligatoire")
    @Size(max = 100)
    String auteur,

    @NotBlank(message = "L''ISBN est obligatoire")
    @Size(max = 20)
    String isbn,

    Double noteMoyenne,

    @Size(max = 1500)
    String description,

    String couvertureUrl,

    @Min(value = 1, message = "Il faut au moins 1 exemplaire")
    Integer nbExemplaires,

    Integer nbExemplairesDisponibles,

    // le libellé pour la catégorie
    @NotNull(message = "La catégorie est obligatoire")
    String categoryLibelle
    ) {}