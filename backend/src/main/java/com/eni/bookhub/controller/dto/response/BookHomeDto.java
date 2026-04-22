package com.eni.bookhub.controller.dto.response;

public record BookHomeDto(

        Integer idBook,

        String titre,

        String auteur,

        Double noteMoyenne,

        String couvertureUrl,

        Boolean available
) {
}