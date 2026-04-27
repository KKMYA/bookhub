package com.eni.bookhub.controller.dto.request;


import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Builder;

@Builder
@Schema(description = "Data Transfer Object representing book object.")
public record BookDto(
        @NotBlank(message = "Le titre est obligatoire")
        @Size(max = 255, message = "Le titre ne peut pas dépasser 255 caractères")
        String titre,

        @NotBlank(message = "L'auteur est obligatoire")
        @Size(max = 150, message = "Le nom de l'auteur est trop long")
        String auteur,

        @NotBlank(message = "L'ISBN est obligatoire")
        @Pattern(regexp = "^(978|979)?\\d{10}(\\d{3})?$", message = "Format ISBN invalide (doit être ISBN-10 ou ISBN-13)")
        String isbn,

        @Min(value = 0, message = "La note ne peut pas être inférieure à 0")
        @Max(value = 5, message = "La note ne peut pas dépasser 5")
        Double noteMoyenne,

        @Size(max = 2000, message = "La description est trop longue")
        String description,

        @Pattern(regexp = "^(http|https)://.*", message = "L'URL de couverture doit être une URL valide")
        String couvertureUrl,

        @NotNull(message = "Le nombre d'exemplaires est obligatoire")
        @PositiveOrZero(message = "Le nombre d'exemplaires doit être positif ou égal à zéro")
        Integer nbExemplaires,

        @NotNull(message = "Le nombre d'exemplaires disponibles est obligatoire")
        @PositiveOrZero(message = "Le nombre d'exemplaires disponibles doit être positif ou égal à zéro")
        Integer nbExemplairesDisponibles,

        @NotBlank(message = "Le libellé de la catégorie est obligatoire")
        String categoryLibelle
) {
}
