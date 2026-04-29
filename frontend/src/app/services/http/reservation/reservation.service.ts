import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Endpoints } from '../../../constants/endpoints';
import { CreateReservationRequest, Reservation } from '../../../models/reservation.model';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    constructor(private http: HttpClient) { }

    getMyReservations(): Observable<Reservation[]> {
        return this.http
            .get<Reservation[] | null>(`${Endpoints.getReservationsApiEndpoint}/me`)
            .pipe(map((reservations) => reservations ?? []));
    }

    getPendingReservations(): Observable<Reservation[]> {
        return this.http
            .get<Reservation[] | null>(`${Endpoints.getReservationsApiEndpoint}/pending`)
            .pipe(map((reservations) => reservations ?? []));
    }

    createReservation(idBook: number): Observable<Reservation> {
        const payload: CreateReservationRequest = { idBook };
        return this.http.post<Reservation>(Endpoints.getReservationsApiEndpoint, payload);
    }

    cancelReservation(idReservation: number): Observable<Reservation> {
        return this.http.patch<Reservation>(`${Endpoints.getReservationsApiEndpoint}/${idReservation}/cancel`, {});
    }

    validateReservation(idReservation: number): Observable<Reservation> {
        return this.http.patch<Reservation>(`${Endpoints.getReservationsApiEndpoint}/${idReservation}/validate`, {});
    }

    getMyLoans(): Observable<any[]> {
        return this.http
            .get<any[] | null>(`${Endpoints.getLoansApiEndpoint}/me`)
            .pipe(map((loans) => loans ?? []));
    }

    getReturnedLoans(): Observable<any[]> {
        return this.http
            .get<any[] | null>(`${Endpoints.getLoansApiEndpoint}/returned`)
            .pipe(map((loans) => loans ?? []));
    }

    completeReservation(idReservation: number): Observable<Reservation> {
        return this.http.patch<Reservation>(`${Endpoints.getReservationsApiEndpoint}/${idReservation}/complete`, {});
    }

    getActiveLoans(): Observable<any[]> {
        return this.http
            .get<any[] | null>(`${Endpoints.getLoansApiEndpoint}/active`)
            .pipe(map((loans) => loans ?? []));
    }

    markLoanAsReturned(idLoan: number): Observable<any> {
        return this.http.patch<any>(`${Endpoints.getLoansApiEndpoint}/${idLoan}/mark-as-returned`, {});
    }
}
