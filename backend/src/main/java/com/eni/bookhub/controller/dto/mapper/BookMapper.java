package com.eni.bookhub.controller.dto.mapper;

import com.eni.bookhub.bo.Book;
import com.eni.bookhub.controller.dto.response.BookDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface BookMapper {

    @Mapping(source = "category.libelle", target = "categoryLibelle")
    Book bookDtoToBookEntity(BookDto bookDto);

    @Mapping(target = "category", ignore = true)
    BookDto bookEntityToBookDto(Book fileEntity);
}
