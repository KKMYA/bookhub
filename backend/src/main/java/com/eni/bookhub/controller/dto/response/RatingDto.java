package com.eni.bookhub.controller.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * DTO de réponse pour les avis.
 *
 * Rôle :
 * transporter vers le front uniquement les données utiles
 * d'un avis, sans exposer directement l'entité JPA Rating.
 */
@Getter
@Setter
public class RatingDto {

    private Long idRating;
    private Integer note;
    private String commentaire;
    private LocalDateTime datePublication;
    private Boolean moderation;
    private Long idBook;
    private Long idUser;
}