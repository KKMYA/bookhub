package com.eni.bookhub.controller;

import com.eni.bookhub.bll.BookService;
import com.eni.bookhub.controller.dto.response.BookHomeDto;
import com.eni.bookhub.controller.dto.response.BookDto;
import com.eni.bookhub.exception.BookhubException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    /**
     * Read - Get all books
     *
     * @return - An Iterable object of Book full filled
     */
    @GetMapping()
    @CrossOrigin(origins = "http://localhost:4200")
    @Operation(
            tags = "Bookhub",
            summary = "Tous les livres",
            description = "Récupération de tous les livres"
//            security = @SecurityRequirement(name = "bearer_key")
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Get a list of book"),
            @ApiResponse(responseCode = "204", description = "No content"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    public ResponseEntity<Iterable<BookHomeDto>> getAll() {
        List<BookHomeDto> allBooks = bookService.getBooks();
        if (allBooks.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return new ResponseEntity<>(allBooks, HttpStatus.OK);
    }

    /**
     * Suppression d'un livre
     *
     * @return no return
     */
//    @DeleteMapping("/{id}")
//    @Operation(
//            tags = "Bookhub",
//            summary = "Suppression",
//            description = "Suppréssion d'un livre",
//            security = @SecurityRequirement(name = "bearer_key")
//    )
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "Remove book ok"),
//            @ApiResponse(responseCode = "500", description = "Internal Server Error")
//    })

//    public ResponseEntity<Void> delete(@PathVariable Integer id) {
//        try {
//            bookService.deleteBook(id);
//        } catch (BookhubException e) {
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
//    }
//
//    /**
//     * Create book
//     *
//     * @param bookDto
//     * @return a new book dto
//     */
//    @PostMapping()
//    @Operation(
//            tags = "Bookhub",
//            summary = "création d'un livre",
//            description = "création d'un livre livres",
//            security = @SecurityRequirement(name = "bearer_key")
//    )
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "Success for create book "),
//            @ApiResponse(responseCode = "500", description = "Internal Server Error")
//    })
//    public ResponseEntity<BookDto> create(@RequestBody BookDto bookDto) {
//        BookDto result;
//        result = bookService.createBook(bookDto);
//        return new ResponseEntity<>(result, HttpStatus.OK);
//    }


    /**
     * Find one Book by ID
     *
     * @return bookDto
     */
    @Operation(summary = "Récupérer un livre par son ID",
            description = "Retourne les détails complets d'un livre présent dans le catalogue")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Livre trouvé avec succès"),
            @ApiResponse(responseCode = "404", description = "Livre non trouvé"),
            @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    @GetMapping("/{id}")
    public ResponseEntity<BookDto> getById(@PathVariable Integer id) {
        BookDto bookDto;
        try {
            bookDto = bookService.findBookById(id);
        } catch (BookhubException e) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        return new ResponseEntity<>(bookDto, HttpStatus.OK);
    }
//    /**
//     * Update Book
//     * @param bookDto
//     * @return updating book dto
//     */
//    @PutMapping()
//    @Operation(
//            tags = "Bookhub",
//            summary = "création d'un livre",
//            description = "création d'un livre livres",
//            security = @SecurityRequirement(name = "bearer_key")
//    )
//    @ApiResponses(value = {
//            @ApiResponse(responseCode = "200", description = "Success for create book "),
//            @ApiResponse(responseCode = "500", description = "Internal Server Error")
//    })
//    public ResponseEntity<BookDto> update(@RequestBody BookDto bookDto) {
//        try{
//            bookService.updateBook(bookDto);
//        }catch (BookhubException e){
//            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//        return new ResponseEntity<>(bookDto, HttpStatus.OK);
//    }

}
