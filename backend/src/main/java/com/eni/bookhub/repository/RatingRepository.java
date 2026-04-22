package com.eni.bookhub.repository;

import com.eni.bookhub.bo.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * Repository JPA pour l'entité Rating.
 *
 * Rôle :
 * Fournir l'accès aux données (CRUD + requêtes spécifiques) pour les avis utilisateurs.
 *
 * JpaRepository fournit déjà :
 * - save() -> création / mise à jour
 * - findById() -> récupération par ID
 * - findAll() -> récupération globale
 * - delete() -> suppression
 *
 * Les méthodes ci-dessous ajoutent des requêtes métier spécifiques.
 */
public interface RatingRepository extends JpaRepository<Rating, Long> {

    /**
     * Récupère les avis VALIDÉS (moderation = true) pour un livre donné.
     *
     * Utilisé pour l'affichage public des avis.
     *
     * @param idBook ID du livre
     * @return liste des avis validés
     */
    List<Rating> findByBookIdBookAndModerationTrue(Long idBook);

    /**
     * Récupère les avis NON VALIDÉS (moderation = false).
     *
     * Utilisé pour l'administration (modération des avis).
     *
     * @return liste des avis en attente de validation
     */
    List<Rating> findByModerationFalse();

    /**
     * Calcule la moyenne des notes VALIDÉES pour un livre donné.
     *
     * Important :
     * - Seuls les avis validés sont pris en compte
     * - Correspond à la logique métier du site
     *
     * @param idBook ID du livre
     * @return moyenne des notes (Double), null si aucun avis
     */
    @Query("SELECT AVG(r.note) FROM Rating r WHERE r.book.idBook = :idBook AND r.moderation = true")
    Double getAverageRatingByBook(Long idBook);
}