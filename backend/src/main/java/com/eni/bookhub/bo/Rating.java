package com.eni.bookhub.bo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "Rating")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notation")
    private Integer idNotation;

    @Column(name = "note", nullable = false)
    private Integer note;

    @Column(name = "commentaire", length = 1000)
    private String commentaire;

    @Column(name = "date_publication", nullable = false)
    private Date datePublication;

    @Column(name = "moderation", nullable = false)
    private Boolean moderation;

    @ManyToOne
    @JoinColumn(name = "id_book", nullable = false)
    private Book book;

    // A réactiver quand Account/User sera prêt
    // @ManyToOne
    // @JoinColumn(name = "id_account", nullable = false)
    // private User user;
}