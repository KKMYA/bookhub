package com.eni.bookhub.bll.impl;

import com.eni.bookhub.bll.BookService;
import com.eni.bookhub.bo.Book;
import com.eni.bookhub.controller.dto.mapper.BookMapper;
import com.eni.bookhub.controller.dto.response.BookDto;
import com.eni.bookhub.controller.dto.response.PaginatedFilesDto;
import com.eni.bookhub.exception.BookhubException;
import com.eni.bookhub.exception.EntityAlreadyExistsException;
import com.eni.bookhub.exception.EntityNotFoundException;
import com.eni.bookhub.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    /**
     * get bookDto object
     * use mapper class
     */
    public PaginatedFilesDto<BookDto> getBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> bookPage = bookRepository.findAll(pageable);

        List<BookDto> BookDtos = bookPage.getContent().stream()
                .map(bookMapper::bookEntityToBookDto)
                .toList();
        return new PaginatedFilesDto<>(BookDtos, bookPage.getTotalElements());
    }

    @Override
    public BookDto findBookById(int id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("The book with the id " + id + " cannot be found."));
        return bookMapper.bookEntityToBookDto(book);
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
    public BookDto createBook(BookDto bookDto) {
        //Aller voir si la categorie existe
        //book.setCategory(cat);
        // Gerer la creation de la categorie si elle n existe pas
        if (bookRepository.existsByIsbn(bookDto.isbn())) {
            throw new EntityAlreadyExistsException("Book with ISBN " + bookDto.isbn() + " already exist.");
        }
        try {
            Book book = bookMapper.bookDtoToBookEntity(bookDto);
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

//    /**
//     * Methode findBookByTitle
//     *
//     * @return one object  for front
//     */
//    public BookDto findBookByTitle(String title) {
//        BookDto bookDto = null;
//        BookEntity bookEntity = bookRepository.findByTitle(title);
//        bookDto = BookMapper.map(bookEntity);
//        return bookDto;
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
