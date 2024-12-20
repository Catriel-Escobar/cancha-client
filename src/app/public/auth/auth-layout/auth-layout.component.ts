import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStore } from '../../../core/stores/user-store/auth.store';
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  protected userStore = inject(AuthStore);
  protected router = inject(Router);
  protected activateRoute = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      const error = this.userStore.currentError();
      if (error) {
        this.snackBar.open(error, 'Close', { duration: 3000 });
        this.userStore.clearErrors();
      }
      const message = this.userStore.currentMessage();
      if (message) {
        this.snackBar.open(message, 'Close', { duration: 3000 });
        this.userStore.clearMessages();
      }

      const isLogged = this.userStore.isLogged();
      if (isLogged) {
        this.router.navigate(['/private/dashboard']);
      }
    });
  }
  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe((params) => {
      if (params['name']) {
        const name = params['name'];
        this.snackBar.open(
          `Bienvenid@ ${name}! Su email fue verificado correctamente.`,
          'Close',
          { duration: 3000 }
        );
      }
    });
  }
}
