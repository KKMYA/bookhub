package com.eni.bookhub.bo;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "Reservation")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reservation")
    private Long idReservation;

    @Column(name = "date_reservation", nullable = false)
    private LocalDate dateReservation;

    @Column(name = "rang_file_attente")
    private Integer rangFileAttente;

    @Column(name = "statut", nullable = false, length = 30)
    private String statut;

    @ManyToOne
    @JoinColumn(name = "id_book", nullable = false)
    private Book book;

    @ManyToOne
    @JoinColumn(name = "id_account", nullable = false)
    private Account account;

    @PrePersist
    public void applyDefaults() {
        if (dateReservation == null) {
            dateReservation = LocalDate.now();
        }
        if (statut == null || statut.isBlank()) {
            statut = "PENDING";
        }
    }
}
