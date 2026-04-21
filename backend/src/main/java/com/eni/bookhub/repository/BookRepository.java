package com.eni.bookhub.repository;

import com.eni.bookhub.bo.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    Book findByTitle(String title);
    Book findByIsbn(String isbn);
    Boolean existsByByIsbn(String isbn);
}
