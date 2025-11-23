import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-mechanic-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './mechanic-menu.component.html',
  styleUrl: './mechanic-menu.component.css'
})
export class MechanicMenuComponent implements OnInit {
  userName: string = 'Mécanicien';
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get user info if available
    const userId = this.userService.getUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.userName = `${user.firstName} ${user.lastName}`;
        },
        error: () => {
          // Keep default name if error
        }
      });
    }
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}

