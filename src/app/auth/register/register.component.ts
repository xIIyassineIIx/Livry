import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Region } from '../../models/region';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  regions = Object.values(Region);

  constructor(private fb: FormBuilder, private authService: UserService, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      region: [Region.TUNIS, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const payload = {
      ...this.registerForm.value,
      role: 'CLIENT'
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.successMessage = 'Compte créé avec succès !';
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (error) => {
        if (error.status === 0 || error.message?.includes('ERR_CONNECTION_REFUSED') || error.message?.includes('Failed to fetch')) {
          this.errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier que le serveur backend est démarré.';
        } else if (error.status === 400) {
          this.errorMessage = error.error?.error || 'Données invalides. Veuillez vérifier vos informations.';
        } else {
          this.errorMessage = 'Échec de la création du compte. Veuillez réessayer.';
        }
      }
    });
  }
}
