package com.eni.bookhub.controller.dto.mapper;

import com.eni.bookhub.bo.Reservation;
import com.eni.bookhub.controller.dto.request.CreateReservationRequestDto;
import com.eni.bookhub.controller.dto.response.BookSumaryDto;
import com.eni.bookhub.controller.dto.response.ReservationDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReservationMapper {

    @Mapping(target = "idReservation", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "account", ignore = true)
    Reservation createReservationRequestDtoToReservationEntity(CreateReservationRequestDto request);

    @Mapping(source = "book.idBook", target = "idBook")
    @Mapping(source = "account.idAccount", target = "idAccount")
    @Mapping(source = "book", target = "book")
    ReservationDto reservationEntityToReservationDto(Reservation reservation);

    BookSumaryDto toBookSummaryDto(com.eni.bookhub.bo.Book book);
}
