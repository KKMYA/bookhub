package com.eni.bookhub.controller;

import com.eni.bookhub.bll.LoanService;
import com.eni.bookhub.controller.dto.response.LoanDto;
import com.eni.bookhub.exception.BookhubException;
import com.eni.bookhub.exception.EntityNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class LoanController {

    private final LoanService loanService;

    @GetMapping()
    @Operation(
            tags = "Bookhub",
            summary = "Tous les emprunts",
            description = "Récupération de tous les emprunts"
    )
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Get a list of loan"),
            @ApiResponse(responseCode = "204", description = "No content"),
            @ApiResponse(responseCode = "500", description = "Internal Server Error")
    })
    public ResponseEntity<Iterable<LoanDto>> getAll() {
        List<LoanDto> allLoans = loanService.getLoans();
        if (allLoans.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return new ResponseEntity<>(allLoans, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupérer un emprunt par son ID", description = "Retourne les détails d'un emprunt")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Emprunt trouvé avec succès"),
            @ApiResponse(responseCode = "404", description = "Emprunt non trouvé"),
            @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    public ResponseEntity<LoanDto> getById(@PathVariable Integer id) {
        LoanDto loanDto;
        try {
            loanDto = loanService.findLoanById(id);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (BookhubException e) {
            return ResponseEntity.badRequest().build();
        }
        return new ResponseEntity<>(loanDto, HttpStatus.OK);
    }

    @PostMapping()
    @Operation(summary = "Créer un emprunt", description = "Crée un emprunt pour un livre")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Emprunt créé avec succès"),
            @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    public ResponseEntity<LoanDto> create(@RequestBody LoanDto loanDto) {
        LoanDto result = loanService.createLoan(loanDto);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/me")
    @Operation(summary = "Mes emprunts", description = "Récupération des emprunts actifs de l'utilisateur")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des emprunts"),
            @ApiResponse(responseCode = "204", description = "No content"),
            @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    public ResponseEntity<Iterable<LoanDto>> getMyLoans(@org.springframework.security.core.annotation.AuthenticationPrincipal com.eni.bookhub.bo.Account account) {
        List<LoanDto> loans = loanService.getMyLoans(account.getIdAccount());
        if (loans.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/returned")
    @Operation(summary = "Emprunts retournés", description = "Récupération des emprunts retournés (pour les libraires)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des emprunts retournés"),
            @ApiResponse(responseCode = "204", description = "No content"),
            @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    public ResponseEntity<Iterable<LoanDto>> getReturnedLoans() {
        List<LoanDto> loans = loanService.getReturnedLoans();
        if (loans.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/active")
    @Operation(summary = "Emprunts actifs", description = "Récupération de tous les emprunts actifs (pour les libraires)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Liste des emprunts actifs"),
            @ApiResponse(responseCode = "204", description = "No content"),
            @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    public ResponseEntity<Iterable<LoanDto>> getActiveLoans() {
        List<LoanDto> loans = loanService.getActiveLoans();
        if (loans.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(loans);
    }

    @PatchMapping("/{id}/mark-as-returned")
    @Operation(summary = "Marquer un emprunt comme retourné", description = "Change le statut d'un emprunt de ACTIVE à RETURNED")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Emprunt marqué comme retourné"),
            @ApiResponse(responseCode = "404", description = "Emprunt non trouvé"),
            @ApiResponse(responseCode = "500", description = "Erreur interne du serveur")
    })
    public ResponseEntity<LoanDto> markAsReturned(@PathVariable Long id) {
        try {
            LoanDto loanDto = loanService.markAsReturned(id);
            return ResponseEntity.ok(loanDto);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (BookhubException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}