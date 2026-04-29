import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Reservation } from '../../models/reservation.model';
import { ReservationService } from '../../services/http/reservation/reservation.service';
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'app-reservations',
    imports: [LucideAngularModule],
    templateUrl: './reservations.html'
})

export class Reservations implements OnInit {
    private cdr = inject(ChangeDetectorRef);
    private reservationService = inject(ReservationService);

    reservations: Reservation[] = [];
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
                this.reservations = reservations;
            },
            error: (error) => {
                const backendMessage = typeof error?.error === 'string' ? error.error : null;
                this.errorMessage = backendMessage ?? 'Impossible de charger vos reservations.';
                this.reservations = [];
            },
            complete: () => {
                this.loading = false;

                this.cdr.detectChanges();
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

}
