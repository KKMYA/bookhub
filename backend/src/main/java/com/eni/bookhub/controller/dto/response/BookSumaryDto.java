package com.eni.bookhub.controller.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;

@Builder
@Schema(description = "Data Transfer Object representing book for the homepage.")
public record BookSumaryDto(

        String titre,

        String auteur,

        Double noteMoyenne,

        String couvertureUrl,

        String categoryLibelle

) {
}