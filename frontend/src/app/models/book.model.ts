export interface BookHome {
    idBook: number;
    titre: string;
    auteur: string;
    noteMoyenne: number;
    couvertureUrl?: string;
    categoryLibelle?: string;
}

export interface Book extends BookHome {
    isbn: string;
    description: string;
    nbExemplaires: number;
    nbExemplairesDisponibles: number;
}


export interface BookDto {
    idBook: number;
    titre: string;
    auteur: string;
    isbn: string;
    description: string;
    noteMoyenne: number;
    categoryLibelle?: string;
    couvertureUrl?: string;
    nbExemplaires: number;
    nbExemplairesDisponibles: number;
    hasActiveReservation?: boolean;
}
