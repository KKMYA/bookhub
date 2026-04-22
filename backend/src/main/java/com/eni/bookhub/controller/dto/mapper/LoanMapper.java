package com.eni.bookhub.controller.dto.mapper;

import com.eni.bookhub.bo.Loan;
import com.eni.bookhub.controller.dto.response.LoanDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LoanMapper {

    @Mapping(target = "book.idBook", source = "idBook")
    Loan loanDtoToLoanEntity(LoanDto loanDto);

    @Mapping(source = "book.idBook", target = "idBook")
    LoanDto loanEntityToLoanDto(Loan loan);
}