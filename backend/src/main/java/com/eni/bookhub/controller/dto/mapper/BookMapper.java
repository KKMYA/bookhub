package com.eni.bookhub.controller.dto.mapper;

import com.eni.bookhub.bo.Book;
import com.eni.bookhub.controller.dto.response.BookDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookMapper {

    @Mapping(source = "categoryLibelle", target = "category.libelle")
    Book bookDtoToBookEntity(BookDto bookDto);

    @Mapping(target ="category.libelle", ignore = true)
    BookDto bookEntityToBookDto(Book book);
}
