import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormField, form, required } from '@angular/forms/signals';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthServicios } from '../../servicios/auth-servicios';
import { LoginRequest } from '../../interfaces/auth';

@Component({
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormField],
  selector: 'app-login-page',
  styleUrl: './login-page.scss',
  templateUrl: './login-page.html',
})
export class LoginPage {

  private authService = inject(AuthServicios)
  private router = inject(Router)
  private _snackBar = inject(MatSnackBar)

  private loginModel = signal({ email: '', password: '' })

  protected loginForm = form(this.loginModel, (field) => {
    required(field.email);
    required(field.password);
  })

  login(): void {
    const { email, password } = this.loginForm().value()
    const req: LoginRequest = { email, password }

    this.authService.login(req).subscribe({
      next: () => {
        this.router.navigateByUrl('/')
      },
      error: () => {
        this._snackBar.open('Correo o contraseña incorrectos', 'ok', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 2000
        })
      }
    })
  }
}
