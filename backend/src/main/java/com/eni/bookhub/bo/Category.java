package com.eni.bookhub.bo;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_categorie")
    private Integer idCategorie;

    @Column(nullable = false, unique = true, length = 50)
    private String libelle;

    // Optionnel : Relation inverse pour récupérer tous les livres d'une catégorie
    // @OneToMany(mappedBy = "category")
    // private List<Book> books;
}
