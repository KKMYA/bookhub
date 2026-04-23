package com.eni.bookhub.controller.dto.mapper;

import com.eni.bookhub.bo.Rating;
import com.eni.bookhub.controller.dto.response.RatingDto;
import org.springframework.stereotype.Component;

/**
 * Mapper dédié à l'entité Rating.
 *
 * Rôle :
 * Convertir un objet métier / entité JPA Rating
 * en objet de transfert RatingDto.
 */
@Component
public class RatingMapper {

    /**
     * Convertit une entité Rating en RatingDto.
     *
     * @param rating entité à convertir
     * @return DTO correspondant, ou null si rating est null
     */
    public RatingDto toDto(Rating rating) {
        if (rating == null) {
            return null;
        }

        RatingDto dto = new RatingDto();
        dto.setIdRating(rating.getIdRating());
        dto.setNote(rating.getNote());
        dto.setCommentaire(rating.getCommentaire());
        dto.setDatePublication(rating.getDatePublication());
        dto.setModeration(rating.getModeration());


        if (rating.getBook() != null) {
            dto.setIdBook(Long.valueOf(rating.getBook().getIdBook()));
        }
        // A implanter quand user prêt
       // if (rating.getUser() != null) {
       //     dto.setIdUser(rating.getUser().getIdUser());
       // }

        return dto;
    }
}