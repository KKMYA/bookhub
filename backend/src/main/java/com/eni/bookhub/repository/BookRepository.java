package com.eni.bookhub.repository;

import com.eni.bookhub.bo.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

    Book findByTitre(String titre);
    Book findByIsbn(String isbn);
    Boolean existsByIsbn(String isbn);
}
