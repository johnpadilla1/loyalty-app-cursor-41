import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar color="primary" class="main-toolbar">
      <span class="app-title"><mat-icon>loyalty</mat-icon> Loyalty App</span>
      <span class="spacer"></span>
      <a mat-button routerLink="/campaign" routerLinkActive="active-link">Campaigns</a>
      <a mat-button routerLink="/reward" routerLinkActive="active-link">Rewards</a>
      <a mat-button routerLink="/loyalty" routerLinkActive="active-link">Loyalty</a>
    </mat-toolbar>
    <main class="main-content">
      <div class="container">
        <router-outlet></router-outlet>
      </div>
    </main>
    <footer>
      &copy; {{ currentYear }} Loyalty App. All rights reserved.
    </footer>
  `,
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  currentYear = new Date().getFullYear();
} 