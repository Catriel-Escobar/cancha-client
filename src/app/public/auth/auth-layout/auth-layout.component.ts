import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthStore } from '../../../core/stores/user-store/auth.store';
import { LogoComponent } from '../../../shared/icons/logo/logo.component';
import { AppTextStyleDirective } from '../../../shared/directives/app-text-style.directive';
@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterModule,LogoComponent ,AppTextStyleDirective],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  protected userStore = inject(AuthStore);
  protected router = inject(Router);
  protected activateRoute = inject(ActivatedRoute);
  fullUrl: string = '';
  protected text = signal<string>('');
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
  
      let textIni = this.router.url?.includes('login') ? 'Inicia sesión para comenzar.' : 'Crea tu cuenta para comenzar.'; // URL completa
      this.text.set(textIni);
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.fullUrl = event.urlAfterRedirects;
          textIni = this.router.url?.includes('login') ? 'Inicia sesión para comenzar.' : 'Crea tu cuenta para comenzar.'; // URL completa
          this.text.set(textIni);
        
        }
      });
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
