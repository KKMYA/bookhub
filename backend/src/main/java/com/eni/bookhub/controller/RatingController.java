package com.eni.bookhub.controller;

import com.eni.bookhub.bll.RatingService;
import com.eni.bookhub.controller.dto.request.CreateRatingRequestDTO;
import com.eni.bookhub.controller.dto.request.UpdateRatingRequestDTO;
import com.eni.bookhub.controller.dto.response.RatingDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

/**
 * Controller REST dédié à la gestion des avis.
 *
 * Rôle :
 * exposer les endpoints HTTP liés aux notations,
 * puis déléguer la logique métier au service.
 *
 * Important :
 * - Le controller ne contient PAS de logique métier
 * - Il reçoit les requêtes HTTP
 * - Il appelle le service
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
     * Bonne pratique :
     * - les données sont envoyées dans le body (JSON)
     * - utilisation d'un DTO + validation (@Valid)
     *
     * @param idBook identifiant du livre
     * @param request DTO contenant note + commentaire
     * @return le DTO de l'avis créé
     */
    @PostMapping("/books/{id}/ratings")
    public RatingDto createRating(
            @PathVariable("id") Long idBook,
            @Valid @RequestBody CreateRatingRequestDTO request) {

        return ratingService.createRating(idBook, request);
    }

    /**
     * Valide un avis (action admin).
     *
     * @param idRating identifiant de l'avis
     * @return avis validé
     */
    @PutMapping("/ratings/{id}/validate")
    public RatingDto validateRating(@PathVariable("id") Long idRating) {
        return ratingService.validateRating(idRating);
    }

    /**
     * Modifie un avis existant.
     *
     * Logique :
     * - reçoit un DTO
     * - délègue au service
     *
     * @param idRating identifiant de l'avis
     * @param request nouvelles données
     * @return avis modifié
     */
    @PatchMapping("/ratings/{id}")
    public RatingDto updateRating(
            @PathVariable("id") Long idRating,
            @Valid @RequestBody UpdateRatingRequestDTO request) {

        return ratingService.updateRating(idRating, request);
    }

    /**
     * Supprime un avis.
     *
     * @param idRating identifiant de l'avis
     */
    @DeleteMapping("/ratings/{id}")
    public void deleteRating(@PathVariable("id") Long idRating) {
        ratingService.deleteRating(idRating);
    }

    /**
     * Récupère un avis par son ID.
     *
     * @param idRating identifiant
     * @return avis
     */
    @GetMapping("/ratings/{id}")
    public RatingDto getRatingById(@PathVariable("id") Long idRating) {
        return ratingService.getRatingById(idRating);
    }

    /**
     * Récupère les avis VALIDÉS d'un livre.
     *
     * @param idBook identifiant du livre
     * @return liste des avis validés
     */
    @GetMapping("/books/{id}/ratings")
    public Page<RatingDto> getValidatedRatingsByBook(@PathVariable("id") Long idBook, Pageable pageable) {
        return ratingService.getValidatedRatingsByBook(idBook, pageable);
    }

    /**
     * Récupère les avis en attente de validation.
     *
     * Endpoint généralement réservé à un admin.
     *
     * @return liste des avis non validés
     */
    @GetMapping("/ratings/pending")
    public Page<RatingDto> getPendingRatings(Pageable pageable) {
        return ratingService.getPendingRatings(pageable);
    }

    /**
     * Récupère la moyenne des notes validées d'un livre.
     *
     * @param idBook identifiant du livre
     * @return moyenne des notes
     */
    @GetMapping("/books/{id}/ratings/average")
    public Double getAverageRatingByBook(@PathVariable("id") Long idBook) {
        return ratingService.getAverageRatingByBook(idBook);
    }
}