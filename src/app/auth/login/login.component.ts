import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserRole } from '../../models/user';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.redirectUser(response.role);
      },
      error: (error) => {
        if (error.status === 0 || error.message?.includes('ERR_CONNECTION_REFUSED') || error.message?.includes('Failed to fetch')) {
          this.errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier que le serveur backend est démarré.';
        } else if (error.status === 400 || error.status === 401) {
          this.errorMessage = 'Email ou mot de passe invalide.';
        } else {
          this.errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
        }
      }
    });
  }

  private redirectUser(role: UserRole): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'CLIENT':
        this.router.navigate(['/client']);
        break;
      case 'DRIVER':
        this.router.navigate(['/deliverer/dashboard']);
        break;
      case 'MECHANIC':
        this.router.navigate(['/mechanic/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
    }
  }
}
