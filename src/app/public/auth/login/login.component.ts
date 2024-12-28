import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthStore } from '../../../core/stores/user-store/auth.store';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { QuestionLinkComponent } from '../../../shared/components/question-link/question-link.component';
type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-login',
  imports: [ 
    QuestionLinkComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  isPasswordVisible = signal<boolean>(false);

  loginForm: FormGroup;
  private fb = inject(NonNullableFormBuilder);
  readonly authStore = inject(AuthStore);
  private email = signal<string | null>('');
  protected activateRoute = inject(ActivatedRoute);
  constructor() {
    this.activateRoute.queryParams.subscribe((params) => {
      if (params['email']) {
        this.email.set(params['email']);
      }
    });
    this.loginForm = this.fb.group({
      email: [this.email(), [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authStore.login({ email, password });
    }
  }

  togglePasswordVisibility() {
    this.isPasswordVisible.set(!this.isPasswordVisible());
  }
}
