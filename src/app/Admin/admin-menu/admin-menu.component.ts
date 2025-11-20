import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-admin-menu',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.css'
})
export class AdminMenuComponent implements OnInit {
  user!: User | undefined;
  constructor(private authService: UserService,) {

  }
  
  ngOnInit(): void {
        this.authService.getAllUsers().subscribe(users => {
          this.user = users.find(u => u.id === Number(localStorage.getItem('userId')));})


  }
  }
 

