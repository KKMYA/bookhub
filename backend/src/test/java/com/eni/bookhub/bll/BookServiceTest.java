package com.eni.bookhub.bll;


import com.eni.bookhub.bll.impl.BookServiceImpl;
import com.eni.bookhub.bo.Book;
import com.eni.bookhub.bo.Category;
import com.eni.bookhub.controller.dto.mapper.BookMapper;
import com.eni.bookhub.controller.dto.request.BookDto;
import com.eni.bookhub.repository.BookRepository;
import com.eni.bookhub.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


@Service
@RequiredArgsConstructor
@ExtendWith(MockitoExtension.class)
public class BookServiceTest {

    @Mock
    private BookRepository bookRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private BookMapper bookMapper;

    @InjectMocks
    private BookServiceImpl bookService;

    private BookDto bookDto;
    private Book bookEntity;
    private Category category;

    @BeforeEach
    void setUp() {
        // Préparation des données de test
        category = new Category();
        category.setLibelle("Roman");

        bookDto = new BookDto(
                "Le Petit Prince", "Saint-Exupéry", "123456789",
                4.5, "Un classique", "url_img", 10, 10, "Roman"
        );

        bookEntity = new Book();
        bookEntity.setTitre("Le Petit Prince");
        bookEntity.setIsbn("123456789");
    }

    @Test
    void createBook_ShouldReturnSavedBook_WhenSuccessful() {
        // GIVEN
        when(categoryRepository.findByLibelle("Roman")).thenReturn(Optional.of(category));
        when(bookRepository.existsByIsbn(bookDto.isbn())).thenReturn(false);
        when(bookMapper.bookDtoToBookEntity(bookDto)).thenReturn(bookEntity);
        when(bookRepository.save(any(Book.class))).thenReturn(bookEntity);
        when(bookMapper.bookEntityToBookDto(bookEntity)).thenReturn(bookDto);

        // WHEN
        BookDto result = bookService.createBook(bookDto);

        // THEN
        assertNotNull(result);
        assertEquals(bookDto.isbn(), result.isbn());
        verify(bookRepository, times(1)).save(any(Book.class));
        verify(categoryRepository, never()).save(any(Category.class)); // Car la catégorie existe déjà
    }

    @Test
    void createBook_ShouldCreateCategory_WhenCategoryDoesNotExist() {
        // GIVEN
        when(categoryRepository.findByLibelle("Roman")).thenReturn(Optional.empty());
        when(categoryRepository.save(any(Category.class))).thenReturn(category);
        when(bookRepository.existsByIsbn(bookDto.isbn())).thenReturn(false);
        when(bookMapper.bookDtoToBookEntity(bookDto)).thenReturn(bookEntity);
        when(bookRepository.save(any(Book.class))).thenReturn(bookEntity);
        when(bookMapper.bookEntityToBookDto(bookEntity)).thenReturn(bookDto);

        // WHEN
        bookService.createBook(bookDto);

        // THEN
        verify(categoryRepository, times(1)).save(any(Category.class));
        verify(bookRepository, times(1)).save(any(Book.class));
    }
}
