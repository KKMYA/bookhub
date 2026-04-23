package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.response.BookSumaryDto;
import com.eni.bookhub.controller.dto.response.BookDetailDto;
import com.eni.bookhub.controller.dto.response.PaginatedFilesDto;

public interface BookService {

    PaginatedFilesDto<BookSumaryDto> getBooks(int page, int size);

    BookDetailDto findBookById(int id);
}
