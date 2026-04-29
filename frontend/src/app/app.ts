import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./ui/header/header";
import { ConfirmDialog } from './ui/components/confirm-dialog/confirm-dialog';
import { PopupService } from './services/ui-ux/popup.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, ConfirmDialog, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
  protected popupService = inject(PopupService);
}
