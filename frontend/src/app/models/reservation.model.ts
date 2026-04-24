export interface ReservationBook {
    idBook: number;
    titre: string;
    auteur: string;
    noteMoyenne: number;
    couvertureUrl?: string;
    categoryLibelle?: string;
    nbExemplairesDisponibles: number;
}

export interface Reservation {
    idReservation: number;
    dateReservation: string;
    rangFileAttente: number;
    statut: string;
    idBook: number;
    idAccount: number;
    book?: ReservationBook;
}

export interface CreateReservationRequest {
    idBook: number;
    dateReservation?: string;
    rangFileAttente?: number;
    statut?: string;
}
