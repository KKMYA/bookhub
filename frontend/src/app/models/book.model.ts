export interface BookHome {
    idBook: number;
    titre: string;
    auteur: string;
    noteMoyenne: number;
    couvertureUrl?: string;
    available: boolean;
}

export interface Book extends BookHome {
    isbn: string;
    description: string;
    categoryLibelle?: string;
    nbExemplaires: number;
    nbExemplairesDisponibles: number;
}
