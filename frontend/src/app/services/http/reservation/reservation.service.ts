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

    createReservation(idBook: number): Observable<Reservation> {
        const payload: CreateReservationRequest = { idBook };
        return this.http.post<Reservation>(Endpoints.getReservationsApiEndpoint, payload);
    }

    cancelReservation(idReservation: number): Observable<Reservation> {
        return this.http.patch<Reservation>(`${Endpoints.getReservationsApiEndpoint}/${idReservation}/cancel`, {});
    }
}
