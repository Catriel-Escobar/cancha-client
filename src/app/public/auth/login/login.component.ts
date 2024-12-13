import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserStore } from '../../../core/stores/user-store/user.store';

type LoginForm = FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>;

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [UserStore],
})
export default class LoginComponent implements OnInit {
  loginForm: FormGroup;
  private fb = inject(NonNullableFormBuilder);
  readonly userStore = inject(UserStore);
  constructor() {
    // Crear formulario reactivo
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Seleccionar estado de errores y carga
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit(): void {
    // Verificar validez del formulario
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
    }
  }
}
