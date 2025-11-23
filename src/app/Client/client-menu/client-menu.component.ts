import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-client-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './client-menu.component.html',
  styleUrl: './client-menu.component.css'
})
export class ClientMenuComponent {
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/login']);
  }
}
