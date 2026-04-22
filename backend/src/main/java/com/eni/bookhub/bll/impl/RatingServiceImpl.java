package com.eni.bookhub.bll.impl;

import com.eni.bookhub.bll.RatingService;
import com.eni.bookhub.bo.Book;
import com.eni.bookhub.bo.Rating;
import com.eni.bookhub.controller.dto.response.RatingDto;
import com.eni.bookhub.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.eni.bookhub.controller.dto.mapper.RatingMapper;

import java.util.Date;
import java.util.List;
/**
 * Implémentation du service JPA pour l'entité Rating.
 *
 * Rôle :
 * Indiquer comment le service Rating fait ce qu'il est capable de faire.
 */
@Service
@RequiredArgsConstructor

public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final RatingMapper ratingMapper;
    /**
     * @param idBook
     * @param note
     * @param commentaire
     * @return
     */
    @Override
    public RatingDto createRating(Long idBook, Integer note, String commentaire) {
        Rating rating = new Rating();

        rating.setNote(note);
        rating.setCommentaire(commentaire);
        rating.setModeration(false);
        rating.setDatePublication(new Date());

        Book book = new Book();
        //book.getBookByID(idBook);
        rating.setBook(book);
        Rating savedRating = ratingRepository.save(rating);
        return ratingMapper.toDto(savedRating);
    }

    /**
     * @param idRating
     * @return
     */
    @Override
    public RatingDto validateRating(Long idRating) {
        Rating rating = ratingRepository.findById(idRating).orElseThrow();

        rating.setModeration(true);

        Rating savedRating = ratingRepository.save(rating);
        return ratingMapper.toDto(savedRating);
    }

    /**
     * @param idRating
     */
    @Override
    public void deleteRating(Long idRating) {

        ratingRepository.deleteById(idRating);
    }

    /**
     * @param idRating
     * @return
     */
    @Override
    public RatingDto getRatingById(Long idRating) {
        return ratingMapper.toDto(ratingRepository.findById(idRating).orElseThrow());
    }

    /**
     * @param idBook
     * @return
     */
    @Override
    public List<RatingDto> getValidatedRatingsByBook(Long idBook) {
        return ratingRepository
                .findByBookIdBookAndModerationTrue(idBook)
                .stream()
                .map(rating -> ratingMapper.toDto(rating))
                .toList();
    }

    /**
     * @return
     */
    @Override
    public List<RatingDto> getPendingRatings() {
        return ratingRepository
                .findByModerationFalse()
                .stream()
                .map(rating -> ratingMapper.toDto(rating))
                .toList();
    }

    /**
     * @param idBook
     * @return
     */
    @Override
    public Double getAverageRatingByBook(Long idBook) {
        return ratingRepository.getAverageRatingByBook(idBook);
    }
}
