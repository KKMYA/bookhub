package com.eni.bookhub.repository;

import com.eni.bookhub.bo.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {

//    Book findByTitre(String titre);
//
    Optional<Book> findByIsbn(String isbn);

    Boolean existsByIsbn(String isbn);


    @Query("""
             Select b FROm Book b
             WHERE (:searchTerm IS NULL OR
             LOWER(b.titre) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
             LOWER(b.auteur) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR
             LOWER(b.isbn) LIKE LOWER(CONCAT('%', :searchTerm, '%')))
             AND (:categoryLibelle IS NULL OR b.category.libelle = :categoryLibelle)
             AND (:isAvailable IS NULL OR
                (:isAvailable = true AND b.nbExemplairesDisponibles > 0) OR
                (:isAvailable = false AND b.nbExemplairesDisponibles = 0))
            """)
    Page<Book> searchBooks(
            @Param("searchTerm") String searchTerm,
            @Param("categoryLibelle") String categoryLibelle,
            @Param("isAvailable") Boolean isAvailable,
            Pageable pageable);

}
