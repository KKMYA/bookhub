package com.eni.bookhub.controller;

import com.eni.bookhub.bll.ReservationService;
import com.eni.bookhub.bo.Account;
import com.eni.bookhub.controller.dto.request.CreateReservationRequestDto;
import com.eni.bookhub.controller.dto.response.ReservationDto;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping("/me")
    public ResponseEntity<List<ReservationDto>> getMyReservations(@AuthenticationPrincipal Account account) {
        List<ReservationDto> reservations = reservationService.getReservationsByAccount(account.getIdAccount());
        if (reservations.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(reservations);
    }

    @PostMapping
    public ResponseEntity<ReservationDto> createReservation(
            @AuthenticationPrincipal Account account,
            @Valid @RequestBody CreateReservationRequestDto request
    ) {
        ReservationDto createdReservation = reservationService.createReservation(account.getIdAccount(), request);
        return ResponseEntity.ok(createdReservation);
    }
}
