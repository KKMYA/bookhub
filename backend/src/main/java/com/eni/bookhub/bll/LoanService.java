package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.response.LoanDto;

import java.util.List;

public interface LoanService {

    List<LoanDto> getLoans();

    LoanDto findLoanById(int id);

    LoanDto createLoan(LoanDto loanDto);

    List<LoanDto> getMyLoans(Long idAccount);

    List<LoanDto> getReturnedLoans();

    List<LoanDto> getActiveLoans();

    LoanDto markAsReturned(Long idLoan);
}