package com.eni.bookhub.controller.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.util.List;

@Builder
@Schema(description = "Data Transfer Object representing the details of pagination parameters for API requests.")
public record PaginatedFilesDto<T>(

        @NotNull
        @Schema(description = "Liste des éléments de la page actuelle.")
        List<T> data,

        @Schema(description = "Nombre total d'éléments")
        long totalElements


) {
    public PaginatedFilesDto {
        if (data == null) {
            data = List.of();
        }
    }
}
