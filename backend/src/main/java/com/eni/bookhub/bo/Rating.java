package com.eni.bookhub.bo;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Rating")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_notation")
    private Long idRating;

    @Column(name = "note", nullable = false)
    @Min(1)
    @Max(5)
    private Integer note;

    @Column(name = "commentaire", length = 1000)
    private String commentaire;

    @Column(name = "date_publication", nullable = false)
    private LocalDateTime datePublication;

    @Column(name = "moderation", nullable = false)
    private Boolean moderation;

    @ManyToOne
    @JoinColumn(name = "id_book", nullable = false)
    private Book book;


    @ManyToOne
    @JoinColumn(name = "id_account", nullable = false)
    private Account account;
}