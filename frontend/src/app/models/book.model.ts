export interface Book {
    id: number
    title: string;
    author: string;
    rating: number;
    imageUrl?: string;
    available: boolean
}