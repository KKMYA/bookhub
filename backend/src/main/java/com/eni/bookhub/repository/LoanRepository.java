package com.eni.bookhub.repository;

import com.eni.bookhub.bo.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Integer> {
}