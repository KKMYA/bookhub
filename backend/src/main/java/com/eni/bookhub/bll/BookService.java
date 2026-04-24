package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.request.BookDto;
import com.eni.bookhub.controller.dto.request.BookSearchDto;
import com.eni.bookhub.controller.dto.response.BookSumaryDto;
import com.eni.bookhub.controller.dto.response.BookDetailDto;
import com.eni.bookhub.controller.dto.response.PaginatedFilesDto;
import org.springframework.data.domain.Pageable;

public interface BookService {

    PaginatedFilesDto<BookSumaryDto> getBooks(Pageable pageable);

    BookDetailDto findBookById(int id, Long idAccount);

    BookDto updateBook(BookDto bookDto);

    void deleteBook(int id);

    BookDto createBook(BookDto bookDto);

    PaginatedFilesDto<BookSumaryDto> searchBooks(BookSearchDto searchDto, Pageable pageable);
}
