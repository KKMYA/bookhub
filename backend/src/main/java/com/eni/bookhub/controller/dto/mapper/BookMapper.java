package com.eni.bookhub.controller.dto.mapper;

import com.eni.bookhub.bo.Book;
import com.eni.bookhub.controller.dto.request.BookDto;
import com.eni.bookhub.controller.dto.response.BookDtoResponse;
import com.eni.bookhub.controller.dto.response.BookSumaryDto;
import com.eni.bookhub.controller.dto.response.BookDetailDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookMapper {

    /**
     * book object with all attributes
     */

    @Mapping(target ="category", ignore = true)
    Book bookDtoToBookEntity(BookDto bookDto);

    @Mapping(source ="category.libelle", target = "categoryLibelle")
    BookDto bookEntityToBookDto(Book book);


    /*
    * Dashboard Libraire
    * */
    @Mapping(source ="category.libelle", target = "categoryLibelle")
    BookDtoResponse bookEntityToBookDtoResponse(Book book);

    /**
     * book Sumary
     */
    @Mapping(source = "category.libelle", target = "categoryLibelle")
    @Mapping(target = "hasActiveReservation", constant = "false")
    BookSumaryDto bookEntityToBookSumaryDto(Book book);


    /**
     * book detail
     */
    @Mapping(source = "categoryLibelle", target = "category.libelle")
    Book bookDetailDtoToBookEntity(BookDetailDto bookDto);

    @Mapping(source = "category.libelle", target = "categoryLibelle")
    @Mapping(target = "hasActiveReservation", constant = "false")
    BookDetailDto bookEntityToBookDetailDto(Book book);



}
