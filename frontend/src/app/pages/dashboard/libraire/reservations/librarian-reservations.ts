import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Reservation } from '../../../../models/reservation.model';
import { ReservationService } from '../../../../services/http/reservation/reservation.service';

@Component({
  selector: 'app-librarian-reservations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './librarian-reservations.html'
})
export class LibrarianReservations implements OnInit {
  private reservationService = inject(ReservationService);
  private cdr = inject(ChangeDetectorRef);

  reservations: Reservation[] = [];
  loading = true;
  actionInProgress = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations(): void {
    this.loading = true;
    this.errorMessage = null;

    this.reservationService.getPendingReservations().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
      },
      error: (error) => {
        const backendMessage = typeof error?.error === 'string' ? error.error : null;
        this.errorMessage = backendMessage ?? 'Impossible de charger les réservations à valider.';
        this.reservations = [];
      },
      complete: () => {
        this.loading = false;
        this.actionInProgress = false;
        this.cdr.detectChanges();
      }
    });
  }

  validateReservation(reservation: Reservation): void {
    const confirmValidation = window.confirm(`Valider la réservation de ${reservation.book?.titre} ?`);
    if (!confirmValidation) {
      return;
    }

    this.actionInProgress = true;
    this.errorMessage = null;

    this.reservationService.validateReservation(reservation.idReservation).subscribe({
      next: () => {
        this.actionInProgress = false;
        this.loadReservations();
      },
      error: (error) => {
        const backendMessage = typeof error?.error === 'string' ? error.error : null;
        this.errorMessage = backendMessage ?? 'Impossible de valider la réservation.';
        this.actionInProgress = false;
        this.cdr.detectChanges();
      }
    });
  }

  parseStatus(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'AVAILABLE':
        return 'Validée';
      case 'CANCELLED':
        return 'Annulée';
      default:
        return status;
    }
  }
}