export interface Book {
    idBook: number;
    titre: string;
    auteur: string;
    isbn: string;
    noteMoyenne: number;
    description: string;
    categorieLibelle?: string;
    couvertureUrl?: string;
    available: boolean
    nbExemplaires: number;
    nbExemplairesDisponibles: number;
}
