package com.eni.bookhub.bo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idBook;

    @Column(nullable = false, length = 150)
    private String titre;

    @Column(nullable = false, length = 100)
    private String auteur;

    @Column(nullable = false)
    private String isbn;

    private Double noteMoyenne;

    private String description;

    private String couvertureUrl;

    private Integer nbExemplaires;

    private Integer nbExemplairesDisponibles;

    @ManyToOne
    @JoinColumn(name = "id_categorie", nullable = false)
    private Category category;
}