package com.eni.bookhub.controller.dto.request;

public record BookDetailDto(

        String titre,

        String auteur,

        Double noteMoyenne,

        String description,

        String couvertureUrl,

        Integer nbExemplairesDisponibles,

        // le libellé pour la catégorie
        String categoryLibelle
) {
}