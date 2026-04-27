package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.request.CreateRatingRequestDTO;
import com.eni.bookhub.controller.dto.request.UpdateRatingRequestDTO;
import com.eni.bookhub.controller.dto.response.RatingDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

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
    RatingDto createRating(Long idBook, CreateRatingRequestDTO request);

    // Passe un avis a moderation = true
    RatingDto validateRating(Long idRating);

    // Modifie un avis, en récupérant la nouvelle note et le nouveau commentaire
    RatingDto updateRating(Long idRating, UpdateRatingRequestDTO request);

    // Supprime un avis
    void deleteRating(Long idRating);

    // // Retourne un avis selon son ID
    RatingDto getRatingById(Long idRating);

    // Retourne les avis avec moderation = true (validés)
    Page<RatingDto> getValidatedRatingsByBook(Long idBook, Pageable pageable);

    // Retourne les avis avec moderation = false (non validés)
    Page<RatingDto> getPendingRatings(Pageable pageable);

    // Retourne la moyenne des notes validées d'un livre selon son ID
    Double getAverageRatingByBook(Long idBook);

    // A implanter quand Account/User sera prêt
    // Retourne les avis d'un utilisateur selon son ID
    // List<RatingDto> getRatingsByUser(Long idUser);
    // Retourne l'auteur d'un avis selon son ID
    // String getRatingAuthor(Long idRating);
}