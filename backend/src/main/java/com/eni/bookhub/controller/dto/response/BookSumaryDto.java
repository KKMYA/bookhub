package com.eni.bookhub.controller.dto.response;

public record BookSumaryDto(

        String titre,

        String auteur,

        Double noteMoyenne,

        String couvertureUrl

) {
}