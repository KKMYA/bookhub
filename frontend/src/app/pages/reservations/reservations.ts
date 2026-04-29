import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Reservation } from '../../models/reservation.model';
import { ReservationService } from '../../services/http/reservation/reservation.service';
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'app-reservations',
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './reservations.html'
})

export class Reservations implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    private reservationService = inject(ReservationService);

    reservations: Reservation[] = [];
    allReservations: Reservation[] = [];
    loans: any[] = [];
    loading: boolean = true;
    errorMessage: string | null = null;

    ngOnInit(): void {
        this.loadReservations();
    }

    loadReservations(): void {
        this.loading = true;
        this.errorMessage = null;

        this.reservationService.getMyReservations().subscribe({
            next: (reservations) => {
                this.allReservations = reservations;
                this.reservations = reservations.filter(r => r.statut !== 'AVAILABLE');
            },
            error: (error) => {
                const backendMessage = typeof error?.error === 'string' ? error.error : null;
                this.errorMessage = backendMessage ?? 'Impossible de charger vos reservations.';
                this.reservations = [];
                this.allReservations = [];
            },
            complete: () => {
                this.loading = false;
                this.cdr.detectChanges();
            }
        });

        this.reservationService.getMyLoans().subscribe({
            next: (loans) => {
                this.loans = loans;
            },
            error: (error) => {
                console.error('Erreur lors du chargement des emprunts:', error);
                this.loans = [];
            }
        });
    }

    cancelReservation(reservation: Reservation): void {
        const confirmCancel = window.confirm(`Annuler la réservation de ${reservation.book?.titre} ?`);
        if (!confirmCancel) {
            return;
        }

        this.loading = true;
        this.errorMessage = null;

        this.reservationService.cancelReservation(reservation.idReservation).subscribe({
            next: () => {
                this.loadReservations();
            },
            error: (error) => {
                const backendMessage = typeof error?.error === 'string' ? error.error : null;
                this.errorMessage = backendMessage ?? 'Impossible d\'annuler la reservation.';
                this.loading = false;
                this.cdr.detectChanges();
            }
        });
    }

    parseStatus(status: string): string {
        switch (status) {
            case 'PENDING':
                return 'En attente';
            case 'AVAILABLE':
                return 'Disponible';
            case 'CANCELLED':
                return 'Annulée';
            default:
                return status;
        }
    }

    getReservationByBook(bookId: number): Reservation | undefined {
        return this.allReservations.find(r => r.idBook === bookId);
    }

}
