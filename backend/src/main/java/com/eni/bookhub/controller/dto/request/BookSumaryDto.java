package com.eni.bookhub.controller.dto.request;

public record BookSumaryDto(

        String titre,

        String auteur,

        Double noteMoyenne,

        String couvertureUrl

) {
}