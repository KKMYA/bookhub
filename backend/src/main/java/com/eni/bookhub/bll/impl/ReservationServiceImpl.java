package com.eni.bookhub.bll.impl;

import com.eni.bookhub.bll.ReservationService;
import com.eni.bookhub.bo.Account;
import com.eni.bookhub.bo.Book;
import com.eni.bookhub.bo.Reservation;
import com.eni.bookhub.controller.dto.mapper.ReservationMapper;
import com.eni.bookhub.controller.dto.request.CreateReservationRequestDto;
import com.eni.bookhub.controller.dto.response.ReservationDto;
import com.eni.bookhub.exception.EntityAlreadyExistsException;
import com.eni.bookhub.exception.EntityNotFoundException;
import com.eni.bookhub.repository.AccountRepository;
import com.eni.bookhub.repository.BookRepository;
import com.eni.bookhub.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private static final List<String> ACTIVE_RESERVATION_STATUSES = List.of("PENDING", "AVAILABLE");

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final AccountRepository accountRepository;
    private final ReservationMapper reservationMapper;

    @Override
    public List<ReservationDto> getReservationsByAccount(Long idAccount) {
        if (!accountRepository.existsById(idAccount)) {
            throw new EntityNotFoundException("Le compte avec l'id " + idAccount + " est introuvable.");
        }

        return reservationRepository.findByAccountIdAccountOrderByDateReservationDesc(idAccount)
                .stream()
                .map(reservationMapper::reservationEntityToReservationDto)
                .toList();
    }

    @Override
    @Transactional
    public ReservationDto createReservation(Long idAccount, CreateReservationRequestDto request) {
        Book book = bookRepository.findById(request.idBook())
                .orElseThrow(() -> new EntityNotFoundException("Le livre avec l'id " + request.idBook() + " est introuvable."));

        Account account = accountRepository.findById(idAccount)
            .orElseThrow(() -> new EntityNotFoundException("Le compte avec l'id " + idAccount + " est introuvable."));

        if (reservationRepository.existsByBookIdBookAndAccountIdAccountAndStatutIn(
                request.idBook(),
            idAccount,
                ACTIVE_RESERVATION_STATUSES
        )) {
            throw new EntityAlreadyExistsException("Une reservation active existe deja pour ce livre et ce compte.");
        }

        Reservation reservation = reservationMapper.createReservationRequestDtoToReservationEntity(request);

        if (reservation.getRangFileAttente() == null) {
            Integer maxRank = reservationRepository.findMaxQueueRankByBookId(request.idBook());
            reservation.setRangFileAttente(maxRank + 1);
        }

        reservation.setBook(book);
        reservation.setAccount(account);

        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.reservationEntityToReservationDto(savedReservation);
    }

    @Override
    @Transactional
    public ReservationDto cancelReservation(Long idAccount, Long idReservation) {
        Reservation reservation = reservationRepository.findById(idReservation)
                .orElseThrow(() -> new EntityNotFoundException("La reservation avec l'id " + idReservation + " est introuvable."));

        if (!reservation.getAccount().getIdAccount().equals(idAccount)) {
            throw new EntityNotFoundException("La reservation avec l'id " + idReservation + " est introuvable.");
        }

        if ("CANCELLED".equals(reservation.getStatut())) {
            return reservationMapper.reservationEntityToReservationDto(reservation);
        }

        reservation.setStatut("CANCELLED");
        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.reservationEntityToReservationDto(savedReservation);
    }
}
