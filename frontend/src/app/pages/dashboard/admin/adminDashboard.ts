import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from "@angular/core";
import { User } from "../../../models/user.model";
import { UserService } from "../../../services/http/user/user.service";
import { Router } from "@angular/router";
import { LucideAngularModule, Pencil, Plus, Trash2, X, Check } from "lucide-angular";
import { Subject, takeUntil } from "rxjs";
import { UserForm } from "../../../ui/components/form/userForm.component";
import { RatingService } from '../../../services/http/rating/rating.service';
import { Rating } from '../../../models/rating.model';
import { ConfirmDialogService } from '../../../services/ui-ux/confirm-dialog.service';
import { PopupService } from '../../../services/ui-ux/popup.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, UserForm],
  templateUrl: './adminDashboard.html'
})
export class AdminDashboard implements OnInit, OnDestroy {

  private userService = inject(UserService);
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private cdr = inject(ChangeDetectorRef);
  private ratingService = inject(RatingService);
  private confirmDialog = inject(ConfirmDialogService);
  protected popupService = inject(PopupService);

  users: User[] = [];
  isLoading = false;
  editingUser: any | null = null;
  isCreating = false;

  pendingRatings: Rating[] = [];
  isLoadingRatings = false;

  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;
  readonly X = X;
  readonly Check = Check;



  roles = ['USER', 'LIBRARIAN', 'ADMIN'];

  ngOnInit(): void {
    this.loadAllUsers();
    this.loadPendingRatings();
  }

  loadAllUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (users) => {
          this.users = users;
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.users = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
  }

  onAddUser(): void {
    this.isCreating = true;
    this.editingUser = {
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: '',
      role: 'USER'
    };
  }

  onEditUser(user: User): void {
    this.isCreating = false;
    this.editingUser = { ...user };
  }

  onCancelEdit(): void {
    this.editingUser = null;
    this.isCreating = false;
  }

  onSaveUser(): void {
    if (this.editingUser) {
      if (this.isCreating) {
        this.userService.createUserByAdmin(this.editingUser)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.onCancelEdit();
              this.loadAllUsers();
            },
            error: (err) => {
              const message = err.error?.message || err.message || 'Erreur inconnue';
              alert('Erreur lors de la création : ' + message);
            }
          });
      } else {
        this.userService.updateUserByAdmin(this.editingUser)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.onCancelEdit();
              this.loadAllUsers();
            },
            error: (err) => {
              const message = err.error?.message || err.message || 'Erreur inconnue';
              alert('Erreur lors de la mise à jour : ' + message);
            }
          });
      }
    }
  }

  onDeleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadAllUsers();
          },
          error: (err) => {
            console.error('Erreur lors de la suppression', err);
          }
        });
    }
  }

  // GESTION DES AVIS EN ATTENTE DE MODERATION

  // Chargement des avis non modérés
  loadPendingRatings(): void {
    this.isLoadingRatings = true;

    this.ratingService.fetchPendingRatings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.pendingRatings = response.content ?? [];
          this.isLoadingRatings = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erreur lors du chargement des avis en attente', err);
          this.pendingRatings = [];
          this.isLoadingRatings = false;
          this.cdr.detectChanges();
        }
      });
  }

  onValidateRating(idRating: number): void {
    if (!idRating) return;

    this.confirmDialog.open({
      title: 'Valider le commentaire',
      message: 'Êtes-vous sûr de vouloir valider le commentaire ?',
      confirmText: 'Valider',
      cancelText: 'Annuler',
      type: 'validate',

      onConfirm: () => {
        this.ratingService.validateRating(idRating).subscribe({
          next: () => {
            this.pendingRatings = this.pendingRatings.filter(
              r => r.idRating !== idRating
            );

            this.popupService.show('Commentaire validé', 'success');
            this.cdr.detectChanges();
          },

          error: () => {
            this.popupService.show('Erreur lors de la validation', 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  onDeleteRating(idRating: number) {
    if (!idRating) return;

    this.confirmDialog.open({
      title: 'Supprimer le commentaire',
      message: 'Êtes-vous sûr de vouloir supprimer ce commentaire ?',
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      type: 'danger',
      onConfirm: () => {
        this.ratingService.deleteRating(idRating).subscribe({
          next: () => {
            this.pendingRatings = this.pendingRatings.filter(
              r => r.idRating !== idRating
            );

            this.popupService.show('Commentaire supprimé', 'success');

            this.cdr.detectChanges();
          },
          error: () => {
            this.popupService.show('Erreur lors de la suppression', 'error');
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
