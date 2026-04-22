package com.eni.bookhub.bll;

import com.eni.bookhub.bo.Book;
import com.eni.bookhub.controller.dto.response.BookDto;
import com.eni.bookhub.controller.dto.response.PaginatedFilesDto;

import java.util.List;

public interface BookService {

    PaginatedFilesDto<BookDto> getBooks(int page, int size);

    BookDto findBookById(int id);
}
