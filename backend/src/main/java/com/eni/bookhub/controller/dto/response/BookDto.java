package com.eni.bookhub.controller.dto.response;

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
