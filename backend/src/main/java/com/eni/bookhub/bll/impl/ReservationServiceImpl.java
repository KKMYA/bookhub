package com.eni.bookhub.bll.impl;

import com.eni.bookhub.bll.ReservationService;
import com.eni.bookhub.bll.LoanService;
import com.eni.bookhub.bo.Account;
import com.eni.bookhub.bo.Book;
import com.eni.bookhub.bo.Loan;
import com.eni.bookhub.bo.Reservation;
import com.eni.bookhub.controller.dto.mapper.ReservationMapper;
import com.eni.bookhub.controller.dto.request.CreateReservationRequestDto;
import com.eni.bookhub.controller.dto.response.LoanDto;
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
    private static final String PENDING_STATUS = "PENDING";
    private static final String AVAILABLE_STATUS = "AVAILABLE";

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;
    private final AccountRepository accountRepository;
    private final ReservationMapper reservationMapper;
    private final LoanService loanService;

    @Override
    public List<ReservationDto> getReservationsByAccount(Long idAccount) {
        if (!accountRepository.existsById(idAccount)) {
            throw new EntityNotFoundException("Le compte", idAccount);
        }

        return reservationRepository.findByAccountIdAccountOrderByDateReservationDesc(idAccount)
                .stream()
                .map(reservationMapper::reservationEntityToReservationDto)
                .toList();
    }

    @Override
    public List<ReservationDto> getPendingReservations() {
        return reservationRepository.findByStatutOrderByDateReservationDesc(PENDING_STATUS)
                .stream()
                .map(reservationMapper::reservationEntityToReservationDto)
                .toList();
    }

    @Override
    @Transactional
    public ReservationDto createReservation(Long idAccount, CreateReservationRequestDto request) {
        Book book = bookRepository.findById(request.idBook())
                .orElseThrow(() -> new EntityNotFoundException("Le livre", request.idBook()));

        Account account = accountRepository.findById(idAccount)
            .orElseThrow(() -> new EntityNotFoundException("Le compte ", idAccount));

        if (reservationRepository.existsByBookIdBookAndAccountIdAccountAndStatutIn(
                request.idBook(),
            idAccount,
                ACTIVE_RESERVATION_STATUSES
        )) {
            throw new EntityAlreadyExistsException("Une reservation", idAccount);
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
                .orElseThrow(() -> new EntityNotFoundException("La reservation", idReservation));

        if (!reservation.getAccount().getIdAccount().equals(idAccount)) {
            throw new EntityNotFoundException("La reservation", idReservation);
        }

        if ("CANCELLED".equals(reservation.getStatut())) {
            return reservationMapper.reservationEntityToReservationDto(reservation);
        }

        reservation.setStatut("CANCELLED");
        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.reservationEntityToReservationDto(savedReservation);
    }

    @Override
    @Transactional
    public ReservationDto validateReservation(Long idReservation) {
        Reservation reservation = reservationRepository.findById(idReservation)
                .orElseThrow(() -> new EntityNotFoundException("La reservation", idReservation));

        if (!PENDING_STATUS.equals(reservation.getStatut())) {
            throw new EntityAlreadyExistsException("La reservation", idReservation);
        }

        LoanDto loanRequest = new LoanDto(
                null,
                null,
                null,
                null,
                null,
                reservation.getBook().getIdBook(),
            Math.toIntExact(reservation.getAccount().getIdAccount()),
            null
        );

        loanService.createLoan(loanRequest);

        reservation.setStatut(AVAILABLE_STATUS);
        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.reservationEntityToReservationDto(savedReservation);
    }

    @Override
    @Transactional
    public ReservationDto completeReservation(Long idReservation) {
        Reservation reservation = reservationRepository.findById(idReservation)
                .orElseThrow(() -> new EntityNotFoundException("La reservation",idReservation));

        if (!AVAILABLE_STATUS.equals(reservation.getStatut())) {
            throw new EntityAlreadyExistsException("reservations",idReservation);
        }

        reservation.setStatut("COMPLETED");
        Reservation savedReservation = reservationRepository.save(reservation);
        return reservationMapper.reservationEntityToReservationDto(savedReservation);
    }
    @Override
    public ReservationDto findReservationByBookAndStatus(Long idBook, String statut, Long idAccount) {
        Reservation reservation = reservationRepository.findByBookIdBookAndStatutAndAccountIdAccount(Math.toIntExact(idBook), statut, idAccount);
        if (reservation == null) {
            throw new EntityNotFoundException("reservation", idBook);
        }
        return reservationMapper.reservationEntityToReservationDto(reservation);
    }}
