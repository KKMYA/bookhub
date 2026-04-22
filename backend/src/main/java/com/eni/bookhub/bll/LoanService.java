package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.response.LoanDto;

import java.util.List;

public interface LoanService {

    List<LoanDto> getLoans();

    LoanDto findLoanById(int id);

    LoanDto createLoan(LoanDto loanDto);
}