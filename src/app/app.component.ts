import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { AuthStore } from './core/stores/user-store/auth.store';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatDividerModule, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'cancha-frontend';
  protected authStore = inject(AuthStore);
  private tokenCheckInterval: number | undefined;
  constructor() {
    effect(() => {
      const isLogged = this.authStore.currentIsLogged();
      const exp = this.authStore.currentExp();

      if (isLogged) {
        if (this.tokenCheckInterval) {
          clearInterval(this.tokenCheckInterval);
        }
        const refreshInterval = Math.max(
          this.authStore.currentExp() - 60000,
          0
        );

        this.tokenCheckInterval = window.setInterval(() => {
          this.authStore.checkLogin();
        }, refreshInterval);
      } else {
        if (this.tokenCheckInterval) {
          clearInterval(this.tokenCheckInterval);
          this.tokenCheckInterval = undefined;
        }
      }
    });
  }
  ngOnInit(): void {
    this.authStore.checkLogin();
  }

  ngOnDestroy(): void {
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }
}
