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
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Loan")
public class Loan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_emprunt")
    private Integer idEmprunt;

    @Column(name = "date_debut", nullable = false)
    private LocalDate dateDebut;

    @Column(name = "date_retour_prevue", nullable = false)
    private LocalDate dateRetourPrevue;

    @Column(name = "date_retour_effective")
    private LocalDate dateRetourEffective;

    @Column(name = "statut", nullable = false, length = 20)
    private String statut;

    @ManyToOne
    @JoinColumn(name = "id_book", nullable = false)
    private Book book;

    @Column(name = "id_account", nullable = false)
    private Integer idAccount;

    @PrePersist
    public void applyDefaults() {
        if (dateDebut == null) {
            dateDebut = LocalDate.now();
        }
        if (dateRetourPrevue == null) {
            dateRetourPrevue = dateDebut.plusDays(14);
        }
        if (statut == null || statut.isBlank()) {
            statut = "ACTIVE";
        }
    }
}