/**
 * DTO envoyé au backend pour la modification d'un avis
 */

export interface UpdateRatingDto {
  note: number;
  commentaire: string;
}
