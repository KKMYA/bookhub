package com.eni.bookhub.bll;

import com.eni.bookhub.bo.Book;
import com.eni.bookhub.controller.dto.response.BookHomeDto;
import com.eni.bookhub.controller.dto.response.BookDto;

import java.util.List;

public interface BookService {

    List<BookHomeDto> getBooks();

    BookDto findBookById(int id);
}
