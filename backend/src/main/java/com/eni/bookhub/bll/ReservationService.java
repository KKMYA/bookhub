package com.eni.bookhub.bll;

import com.eni.bookhub.controller.dto.request.CreateReservationRequestDto;
import com.eni.bookhub.controller.dto.response.ReservationDto;

import java.util.List;

public interface ReservationService {

    List<ReservationDto> getReservationsByAccount(Long idAccount);

    List<ReservationDto> getPendingReservations();

    ReservationDto createReservation(Long idAccount, CreateReservationRequestDto request);

    ReservationDto cancelReservation(Long idAccount, Long idReservation);

    ReservationDto validateReservation(Long idReservation);

    ReservationDto completeReservation(Long idReservation);

    ReservationDto findReservationByBookAndStatus(Long idBook, String statut, Long idAccount);
}
