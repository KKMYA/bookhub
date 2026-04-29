package com.eni.bookhub.repository;

import com.eni.bookhub.bo.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Integer> {

    java.util.List<Loan> findByIdAccountAndStatut(Integer idAccount, String statut);

    java.util.List<Loan> findByStatutOrderByDateRetourEffectiveDesc(String statut);
}