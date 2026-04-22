package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.response.RatingDto;

import java.util.List;

/**
 * Service JPA pour l'entité Rating.
 *
 * Rôle :
 * Indiquer ce que le service Rating est capable de faire.
 *
 * La logique des méthodes ci-dessous est dans la classe RatingServiceImpl.java.
 */
public interface RatingService {

    // Crée un avis avec moderation=false
    RatingDto createRating(Long idBook, Integer note, String commentaire);

    // Passe un avis a moderation = true
    RatingDto validateRating(Long idRating);

    // Supprime un avis
    void deleteRating(Long idRating);

    // // Retourne un avis selon son ID
    RatingDto getRatingById(Long idRating);

    // Retourne les avis avec moderation = true (validés)
    List<RatingDto> getValidatedRatingsByBook(Long idBook);

    // Retourne les avis avec moderation = false (non validés)
    List<RatingDto> getPendingRatings();

    // Retourne la moyenne des notes validées d'un livre selon son ID
    Double getAverageRatingByBook(Long idBook);

    // A implanter quand Account/User sera prêt
    // Retourne les avis d'un utilisateur selon son ID
    // List<RatingDto> getRatingsByUser(Long idUser);
    // Retourne l'auteur d'un avis selon son ID
    // String getRatingAuthor(Long idRating);
}