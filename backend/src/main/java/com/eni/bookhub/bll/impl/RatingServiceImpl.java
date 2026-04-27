package com.eni.bookhub.bll.impl;

import com.eni.bookhub.bll.RatingService;
import com.eni.bookhub.bo.Account;
import com.eni.bookhub.bo.Book;
import com.eni.bookhub.bo.Rating;
import com.eni.bookhub.controller.dto.mapper.RatingMapper;
import com.eni.bookhub.controller.dto.request.CreateRatingRequestDTO;
import com.eni.bookhub.controller.dto.request.UpdateRatingRequestDTO;
import com.eni.bookhub.controller.dto.response.RatingDto;
import com.eni.bookhub.repository.AccountRepository;
import com.eni.bookhub.repository.BookRepository;
import com.eni.bookhub.repository.RatingRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Objects;

/**
 * Implémentation du service pour l'entité Rating.
 *
 * Rôle :
 * indiquer comment le service Rating fait ce qu'il est capable de faire.
 *
 * Cette classe contient la logique métier liée aux avis :
 * - création d'un avis
 * - validation d'un avis
 * - modification d'un avis
 * - suppression d'un avis
 * - récupération des avis validés / en attente
 * - calcul de la moyenne des notes validées
 *
 * Important :
 * - un avis créé est toujours en attente de modération (moderation = false)
 * - un avis modifié repasse en attente de modération
 * - seuls les avis validés sont visibles publiquement
 */
@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    /**
     * Repository d'accès aux avis.
     */
    private final RatingRepository ratingRepository;

    /**
     * Repository d'accès aux livres.
     *
     * Utilisé pour rattacher correctement un avis
     * à un livre existant en base.
     */
    private final BookRepository bookRepository;

    /**
     * Repository d'accès aux utilisateurs
     *
     * Utilisé pour rattacher correctement un avis
     * à un utilisateur existant en base
     */
    private final AccountRepository accountRepository;

    /**
     * Mapper de conversion Rating -> RatingDto.
     */
    private final RatingMapper ratingMapper;

    /**
     * Crée un nouvel avis pour un livre donné.
     *
     * Logique métier :
     * - récupère le livre concerné
     * - crée un nouvel avis
     * - met automatiquement moderation à false
     * - renseigne la date de publication
     * - sauvegarde l'avis
     *
     * @param idBook identifiant du livre
     * @param request DTO contenant la note et le commentaire
     * @return le DTO de l'avis créé
     */
    @Override
    public RatingDto createRating(Long idBook, CreateRatingRequestDTO request) {
        Book book = bookRepository.findById(Math.toIntExact(idBook))
                .orElseThrow(() -> new EntityNotFoundException("Livre introuvable avec l'id : " + idBook));

        String email = Objects.requireNonNull(SecurityContextHolder.getContext()
                        .getAuthentication())
                .getName();

        Account account = accountRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Compte introuvable : " + email));

        Rating rating = new Rating();
        rating.setNote(request.note());
        rating.setCommentaire(request.commentaire());
        rating.setModeration(false);
        rating.setDatePublication(LocalDateTime.now());
        rating.setBook(book);
        rating.setAccount(account);


        Rating savedRating = ratingRepository.save(rating);
        return ratingMapper.toDto(savedRating);
    }

    /**
     * Valide un avis existant.
     *
     * Logique métier :
     * - récupère l'avis
     * - passe moderation à true
     * - sauvegarde la modification
     *
     * @param idRating identifiant de l'avis à valider
     * @return le DTO de l'avis validé
     */
    @Transactional
    public RatingDto validateRating(Long idRating) {
        Rating rating = ratingRepository.findById(idRating)
                .orElseThrow();

        rating.setModeration(true);
        Rating savedRating = ratingRepository.save(rating);

        Book book = rating.getBook();
        recalculateAverage(book);

        return ratingMapper.toDto(savedRating);
    }

    /**
     * Modifie un avis existant.
     *
     * Logique métier :
     * - récupère l'avis
     * - met à jour la note et le commentaire
     * - remet automatiquement moderation à false
     *   car le contenu validé a été modifié
     * - sauvegarde l'avis
     *
     * @param idRating identifiant de l'avis à modifier
     * @param request DTO contenant les nouvelles données
     * @return le DTO de l'avis modifié
     */
    @Override
    public RatingDto updateRating(Long idRating, UpdateRatingRequestDTO request) {
        Rating rating = ratingRepository.findById(idRating)
                .orElseThrow(() -> new EntityNotFoundException("Avis introuvable avec l'id : " + idRating));

        rating.setNote(request.note());
        rating.setCommentaire(request.commentaire());

        // Toute modification invalide la validation précédente
        rating.setModeration(false);


        Rating savedRating = ratingRepository.save(rating);

        Book book = rating.getBook();

        recalculateAverage(book);

        return ratingMapper.toDto(savedRating);
    }

    /**
     * Supprime un avis selon son identifiant.
     *
     * @param idRating identifiant de l'avis à supprimer
     */
    @Override
    @Transactional
    public void deleteRating(Long idRating) {
        Rating rating = ratingRepository.findById(idRating)
                .orElseThrow(() -> new EntityNotFoundException("Avis introuvable avec l'id : " + idRating));

        Book book = rating.getBook();

        ratingRepository.delete(rating);

        recalculateAverage(book);
    }
    /**
     * Retourne un avis selon son identifiant.
     *
     * @param idRating identifiant de l'avis recherché
     * @return le DTO correspondant
     */
    @Override
    public RatingDto getRatingById(Long idRating) {
        Rating rating = ratingRepository.findById(idRating)
                .orElseThrow(() -> new EntityNotFoundException("Avis introuvable avec l'id : " + idRating));

        return ratingMapper.toDto(rating);
    }

    /**
     * Retourne la liste des avis validés pour un livre donné.
     *
     * Logique métier :
     * seuls les avis avec moderation = true doivent être visibles publiquement.
     *
     * @param idBook identifiant du livre
     * @return liste des avis validés
     */
    @Override
    public Page<RatingDto> getValidatedRatingsByBook(Long idBook, Pageable pageable) {
        return ratingRepository
                .findByBookIdBookAndModerationTrue(idBook, pageable)
                .map(ratingMapper::toDto);
    }



    /**
     * Retourne une page d'avis en attente de validation.
     *
     * Logique métier :
     * seuls les avis avec moderation = false doivent apparaître
     * dans l'espace d'administration / modération.
     *
     * La pagination permet de :
     * - limiter le nombre de résultats renvoyés
     * - améliorer les performances
     * - gérer de grands volumes de données
     *
     * @param pageable informations de pagination (page, taille, tri)
     * @return une page d'avis non validés
     */
    @Override
    public Page<RatingDto> getPendingRatings(Pageable pageable) {
        return ratingRepository
                .findByModerationFalse(pageable)
                .map(ratingMapper::toDto);
    }
    /**
     * Retourne la moyenne des notes validées pour un livre donné.
     *
     * Important :
     * - seuls les avis validés sont pris en compte
     * - si aucun avis validé n'existe, on retourne 0.0
     *
     * @param idBook identifiant du livre
     * @return moyenne des notes validées
     */
    @Override
    public Double getAverageRatingByBook(Long idBook) {
        Double average = ratingRepository.getAverageRatingByBook(idBook);
        return average != null ? average : 0.0;
    }

    /**
     * Méthode utilitaire permettant de recalculer la note moyenne d'un livre
     * lors de la validation d'un avis, de sa modification ou de sa suppression.
     *
     * @param book
     */
    private void recalculateAverage(Book book) {
        Double average = ratingRepository.getAverageRatingByBook(Long.valueOf(book.getIdBook()));
        book.setNoteMoyenne(average != null ? average : 0.0);
        bookRepository.save(book);
    }
}