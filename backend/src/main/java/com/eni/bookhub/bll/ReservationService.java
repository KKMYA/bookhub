package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.request.CreateReservationRequestDto;
import com.eni.bookhub.controller.dto.response.ReservationDto;

import java.util.List;

public interface ReservationService {

    List<ReservationDto> getReservationsByAccount(Long idAccount);

    ReservationDto createReservation(Long idAccount, CreateReservationRequestDto request);

    ReservationDto cancelReservation(Long idAccount, Long idReservation);
}
