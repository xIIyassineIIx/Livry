import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css'
})
export class AdminMenuComponent implements OnInit {
  user!: User | undefined;
  
  constructor(
    private authService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.getAllUsers().subscribe(users => {
      this.user = users.find(u => u.id === Number(localStorage.getItem('userId')));
    });
  }

  getInitials(): string {
    if (!this.user?.firstName || !this.user?.lastName) {
      return 'AD';
    }
    return `${this.user.firstName.charAt(0)}${this.user.lastName.charAt(0)}`.toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
 

