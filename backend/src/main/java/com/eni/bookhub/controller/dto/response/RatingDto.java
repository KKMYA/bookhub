package com.eni.bookhub.controller.dto.response;

import lombok.Data;

import java.util.Date;

/**
 * DTO de réponse pour les avis.
 *
 * Rôle :
 * transporter vers le front uniquement les données utiles
 * d'un avis, sans exposer directement l'entité JPA Rating.
 */
@Data
public class RatingDto {

    private Integer idRating;
    private Integer note;
    private String commentaire;
    private Date datePublication;
    private Boolean moderation;
    private Integer idBook;
    private Long idUser;
}