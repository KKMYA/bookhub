/**
 * DTO envoyé au backend pour la création d'un avis
 */

export interface CreateRatingDto {
  note: number;
  commentaire: string;
}
