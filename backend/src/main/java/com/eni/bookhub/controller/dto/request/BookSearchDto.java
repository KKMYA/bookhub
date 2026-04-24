package com.eni.bookhub.controller.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;


@Builder
@Schema(description = "Data Transfer Object representing the search for book.")
public record BookSearchDto(

        @NotBlank
        String searchTerm,

        String categoryLibelle,
        Boolean isAvailable
) {
}
