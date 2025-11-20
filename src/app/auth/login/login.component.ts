import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule,RouterModule ],
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

  onLogin() {
    if (this.loginForm.valid) {
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {

        this.authService.getAllUsers().subscribe(users => {
          const user = users.find(u => u.email === email);

          if (!user) {
            this.errorMessage = 'User not found.';
            return;
          }

          console.log('User found:', user);

          switch (user.role) {
            case 'ADMIN':
              this.router.navigate(['/admin']);
              break;
            case 'CLIENT':
              this.router.navigate(['/client']);
              break;
            case 'DRIVER':
              this.router.navigate(['/deliverer']);
              break;
            default:
              this.router.navigate(['/login']);
          }

          console.log('Logged in successfully');
        });
      },
      error: (err) => {
        this.errorMessage = 'Invalid email or password.';
        console.error(err);
      }
    });
  }
  }
}

