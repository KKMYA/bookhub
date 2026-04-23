package com.eni.bookhub.bll.impl;

import com.eni.bookhub.bll.BookService;
import com.eni.bookhub.bo.Book;
import com.eni.bookhub.bo.Category;
import com.eni.bookhub.controller.dto.mapper.BookMapper;
import com.eni.bookhub.controller.dto.response.BookDto;
import com.eni.bookhub.controller.dto.request.BookSumaryDto;
import com.eni.bookhub.controller.dto.request.BookDetailDto;
import com.eni.bookhub.controller.dto.response.PaginatedFilesDto;
import com.eni.bookhub.exception.BookhubException;
import com.eni.bookhub.exception.EntityAlreadyExistsException;
import com.eni.bookhub.exception.EntityNotFoundException;
import com.eni.bookhub.repository.BookRepository;
import com.eni.bookhub.repository.CategoryRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BookMapper bookMapper;

    /**
     * get bookDto object
     * use mapper class
     */
    public PaginatedFilesDto<BookSumaryDto> getBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> bookPage = bookRepository.findAll(pageable);

        List<BookSumaryDto> BookListDtos = bookPage.getContent().stream()
                .map(bookMapper::bookEntityToBookSumaryDto)
                .toList();
        return new PaginatedFilesDto<>(BookListDtos, bookPage.getTotalElements());
    }

    @Override
    public BookDetailDto findBookById(int id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("The book with the id " + id + " cannot be found."));
        return bookMapper.bookEntityToBookDetailDto(book);
    }

    /**
     * @param id
     * @throws BookhubException
     */
    public void deleteBook(Integer id) throws BookhubException {
        try {
            if (!bookRepository.existsById(id)) {
                throw new BookhubException("Book with " + id + " not found");
            }
            bookRepository.deleteById(id);
        } catch (NoSuchElementException e) {
            throw new RuntimeException("Error when remove the book ", e);
        }
    }

    /**
     * @param bookDto
     * @return BookDto : object for front
     */
    @Transactional
    public BookDto createBook(BookDto bookDto) {
        String categoryName = bookDto.categoryLibelle();
        Category category = categoryRepository.findByName(categoryName)
                .orElseGet(() -> {
                    Category newCategory = new Category();
                    newCategory.setLibelle(categoryName);
                    return categoryRepository.save(newCategory);
                });
        if (bookRepository.existsByIsbn(bookDto.isbn())) {
            throw new EntityAlreadyExistsException("Book with ISBN " + bookDto.isbn() + " already exist.");
        }
        try {
            Book book = bookMapper.bookDtoToBookEntity(bookDto);
            book.setCategory(category);
            Book savedBook = bookRepository.save(book);
            return bookMapper.bookEntityToBookDto(savedBook);
        } catch (Exception e) {
            throw new BookhubException("Error when create the book: " + e.getMessage());

        }
    }

//    public BookDto updateBook(BookDto bookDto) throws BookhubException {
//        Book Book;
//        try {
//            Book = bookRepository.save(BookMapper.map(bookDto));
//        } catch (NoSuchElementException e) {
//            System.out.println("Recovery error : " + e.getMessage());
//            throw new BookhubException("Can't update this book");
//        }
//        return BookMapper.map(bookEntity);
//    }
    /*************Pour la recherche ***************************************/

    /**
     * Methode findBookByTitle
     *
     * @return one object  for front
//     */
//    public BookDetailDto findBookByTitle(String title) {
//        BookDetailDto bookDetailDto = null;
//        BookListDto bookEntity = bookRepository.findByTitre(title);
//        bookDetailDto = BookMapper.map(bookEntity);
//        return bookDetailDto;
//    }

    /**
     * findBookByIsbn
     *
     * @return one object identify by isbn
     */
//    public BookDto findBookByIsbn(Integer isbn) {
//        BookDto bookDto = null;
//        BookEntity bookEntity = bookRepository.findByIsbn(isbn);
//        bookDto = BookMapper.map(bookEntity);
//        return bookDto;
//
//    }
//
//    public List<BookDto> findBooksOrderByDateDesc() {
//        List<BookEntity> bookEntity = bookRepository.findOrderByAddDateDesc();
//        return BookMapper.mapEntities(bookEntity);
//
//    }
}
