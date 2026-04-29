import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReservationService } from '../../../../services/http/reservation/reservation.service';
import { LucideAngularModule } from "lucide-angular";

@Component({
    selector: 'app-librarian-returns',
    imports: [CommonModule, LucideAngularModule],
    templateUrl: './librarian-returns.html'
})
export class LibrarianReturns implements OnInit {
    private reservationService = inject(ReservationService);

    activeLoans = signal<any[]>([]);
    loansWithReservations = signal<any[]>([]);
    loading = signal(true);
    actionInProgress = signal(false);
    errorMessage = signal<string | null>(null);
    processingLoanId = signal<number | null>(null);

    ngOnInit(): void {
        this.loadActiveLoans();
    }

    loadActiveLoans(): void {
        this.loading.set(true);
        this.errorMessage.set(null);

        this.reservationService.getActiveLoans().subscribe({
            next: (loans) => {
                console.log('Emprunts actifs chargés:', loans);

                this.activeLoans.set(loans);
                this.enrichLoansWithReservations();
                this.loading.set(false);
            },
            error: (error) => {
                console.error('Erreur lors du chargement des emprunts actifs:', error);
                this.errorMessage.set('Impossible de charger les emprunts actifs.');
                this.activeLoans.set([]);
                this.loading.set(false);
            }
        });
    }

    private enrichLoansWithReservations(): void {
        // Pour chaque emprunt ACTIVE, on cherche une réservation AVAILABLE correspondante
        this.loansWithReservations.set(this.activeLoans().map(loan => ({
            ...loan,
            reservationId: null
        })));
    }

    returnLoan(loan: any): void {
        const confirmReturn = window.confirm(`Confirmer le retour de "${loan.book?.titre}" ?`);
        if (!confirmReturn) {
            return;
        }

        this.processingLoanId.set(loan.idEmprunt);
        this.actionInProgress.set(true);

        // 1. Marquer l'emprunt comme retourné
        this.reservationService.markLoanAsReturned(loan.idEmprunt).subscribe({
            next: (returnedLoan) => {
                this.processingLoanId.set(null);
                this.actionInProgress.set(false);
                this.loadActiveLoans();
            },
            error: (error) => {
                const backendMessage = typeof error?.error === 'string' ? error.error : null;
                this.errorMessage.set(backendMessage ?? 'Erreur lors du retour du livre.');
                this.processingLoanId.set(null);
                this.actionInProgress.set(false);
            }
        });
    }


    parseDate(date: string | null): string {
        if (!date) return '-';
        try {
            const parsedDate = new Date(date);
            return parsedDate.toLocaleDateString('fr-FR');
        } catch {
            return date;
        }
    }
}
