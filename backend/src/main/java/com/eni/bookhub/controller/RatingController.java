package com.eni.bookhub.controller;

import com.eni.bookhub.bll.RatingService;
import com.eni.bookhub.controller.dto.response.RatingDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller REST dédié à la gestion des avis.
 *
 * Rôle :
 * exposer les endpoints HTTP liés aux notations,
 * puis déléguer la logique métier au service.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RatingController {

    /**
     * Service métier chargé de gérer les avis.
     */
    private final RatingService ratingService;

    /**
     * Crée un nouvel avis pour un livre donné.
     *
     * @param idBook identifiant du livre concerné
     * @param note note attribuée au livre
     * @param commentaire commentaire associé à l'avis
     * @return le DTO de l'avis créé
     */
    @PostMapping("/books/{id}/ratings")
    public RatingDto createRating(
            @PathVariable("id") Long idBook,
            @RequestParam Integer note,
            @RequestParam String commentaire) {

        return ratingService.createRating(idBook, note, commentaire);
    }

    /**
     * Valide un avis en attente de modération.
     *
     * @param idRating identifiant de l'avis à valider
     * @return le DTO de l'avis validé
     */
    @PutMapping("/ratings/{id}")
    public RatingDto validateRating(@PathVariable("id") Long idRating) {
        return ratingService.validateRating(idRating);
    }

    /**
     * Supprime un avis selon son identifiant.
     *
     * @param idRating identifiant de l'avis à supprimer
     */
    @DeleteMapping("/ratings/{id}")
    public void deleteRating(@PathVariable("id") Long idRating) {
        ratingService.deleteRating(idRating);
    }

    /**
     * Récupère un avis selon son identifiant.
     *
     * @param idRating identifiant de l'avis recherché
     * @return le DTO correspondant
     */
    @GetMapping("/ratings/{id}")
    public RatingDto getRatingById(@PathVariable("id") Long idRating) {
        return ratingService.getRatingById(idRating);
    }

    /**
     * Récupère la liste des avis validés pour un livre donné.
     *
     * @param idBook identifiant du livre
     * @return liste des avis validés du livre
     */
    @GetMapping("/books/{id}/ratings")
    public List<RatingDto> getValidatedRatingsByBook(@PathVariable("id") Long idBook) {
        return ratingService.getValidatedRatingsByBook(idBook);
    }

    /**
     * Récupère les avis en attente de validation.
     *
     * @return liste des avis non validés
     */
    @GetMapping("/ratings/pending")
    public List<RatingDto> getPendingRatings() {
        return ratingService.getPendingRatings();
    }

    /**
     * Récupère la moyenne des notes validées d'un livre.
     *
     * @param idBook identifiant du livre
     * @return moyenne des notes validées
     */
    @GetMapping("/books/{id}/ratings/average")
    public Double getAverageRatingByBook(@PathVariable("id") Long idBook) {
        return ratingService.getAverageRatingByBook(idBook);
    }
}