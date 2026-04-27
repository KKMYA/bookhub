import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, X, Check } from 'lucide-angular';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="mb-8 bg-blue-50 p-6 rounded-xl border border-blue-200 shadow-sm">
      <h2 class="text-xl font-bold text-blue-900 mb-4">
        {{ isCreating ? 'Nouvel utilisateur' : 'Modifier l\\'utilisateur : ' + user.nom + ' ' + user.prenom }}
      </h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-blue-800">Nom</label>
          <input [(ngModel)]="user.nom" name="nom" class="w-full mt-1 p-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-blue-800">Prénom</label>
          <input [(ngModel)]="user.prenom" name="prenom" class="w-full mt-1 p-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-blue-800">Email</label>
          <input [(ngModel)]="user.email" name="email" type="email" class="w-full mt-1 p-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div>
          <label class="block text-sm font-medium text-blue-800">Téléphone</label>
          <input [(ngModel)]="user.telephone" name="telephone" class="w-full mt-1 p-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500">
        </div>
        
        <div *ngIf="isCreating">
          <label class="block text-sm font-medium text-blue-800">Mot de passe</label>
          <input [(ngModel)]="user.password" name="password" type="password" class="w-full mt-1 p-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500">
        </div>

        <div>
          <label class="block text-sm font-medium text-blue-800">Rôle</label>
          <select [(ngModel)]="user.role" name="role" class="w-full mt-1 p-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500">
            <option *ngFor="let role of roles" [value]="role">{{ role }}</option>
          </select>
        </div>
      </div>

      <div class="flex justify-end gap-3 mt-6">
        <button (click)="cancel.emit()" class="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-semibold transition">
          <lucide-angular [img]="XIcon" class="w-4 h-4"></lucide-angular> Annuler
        </button>
        <button (click)="save.emit(user)" class="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition">
          <lucide-angular [img]="CheckIcon" class="w-4 h-4"></lucide-angular> {{ isCreating ? 'Créer' : 'Enregistrer' }}
        </button>
      </div>
    </div>
  `
})
export class UserForm {
  @Input() user: any = {};
  @Input() isCreating = false;
  @Input() roles: string[] = ['USER', 'LIBRARIAN', 'ADMIN'];

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  readonly XIcon = X;
  readonly CheckIcon = Check;
}
