import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from "@angular/core";
import { User } from "../../../models/user.model";
import { UserService } from "../../../services/http/user/user.service";
import { Router } from "@angular/router";
import { LucideAngularModule, Pencil, Plus, Trash2, X, Check } from "lucide-angular";
import { Subject, takeUntil } from "rxjs";
import { UserForm } from "../../../ui/components/form/userForm.component";

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

  users: User[] = [];
  isLoading = false;
  editingUser: any | null = null;
  isCreating = false;

  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Plus = Plus;
  readonly X = X;
  readonly Check = Check;

  roles = ['USER', 'LIBRARIAN', 'ADMIN'];

  ngOnInit(): void {
    this.loadAllUsers();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
