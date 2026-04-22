package com.eni.bookhub.bll.impl;

import com.eni.bookhub.bll.LoanService;
import com.eni.bookhub.bo.Loan;
import com.eni.bookhub.controller.dto.mapper.LoanMapper;
import com.eni.bookhub.controller.dto.response.LoanDto;
import com.eni.bookhub.exception.BookhubException;
import com.eni.bookhub.exception.EntityNotFoundException;
import com.eni.bookhub.repository.BookRepository;
import com.eni.bookhub.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final LoanMapper loanMapper;
    private final BookRepository bookRepository;

    @Override
    public List<LoanDto> getLoans() {
        return loanRepository.findAll()
                .stream()
                .map(loanMapper::loanEntityToLoanDto)
                .toList();
    }

    @Override
    public LoanDto findLoanById(int id) {
        Loan loan = loanRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("The loan with the id " + id + " cannot be found."));
        return loanMapper.loanEntityToLoanDto(loan);
    }

    @Override
    public LoanDto createLoan(LoanDto loanDto) {
        if (loanDto.idBook() == null) {
            throw new BookhubException("A book id is required to create a loan.");
        }
        if (!bookRepository.existsById(loanDto.idBook())) {
            throw new EntityNotFoundException("The book with the id " + loanDto.idBook() + " cannot be found.");
        }

        Loan loan = loanMapper.loanDtoToLoanEntity(loanDto);
        Loan savedLoan = loanRepository.save(loan);
        return loanMapper.loanEntityToLoanDto(savedLoan);
    }
}