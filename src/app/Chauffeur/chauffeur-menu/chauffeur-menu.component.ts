import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-chauffeur-menu',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './chauffeur-menu.component.html',
  styleUrl: './chauffeur-menu.component.css'
})
export class ChauffeurMenuComponent implements OnInit {
  userName: string = 'Chauffeur';
  userRegion: string | null = null;
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.userService.getUserId();
    this.userRegion = this.userService.getRegion();
    
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user: User) => {
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
