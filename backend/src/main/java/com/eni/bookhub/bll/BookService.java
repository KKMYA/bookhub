package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.request.BookSumaryDto;
import com.eni.bookhub.controller.dto.request.BookDetailDto;
import com.eni.bookhub.controller.dto.response.PaginatedFilesDto;

public interface BookService {

    PaginatedFilesDto<BookSumaryDto> getBooks(int page, int size);

    BookDetailDto findBookById(int id);
}
