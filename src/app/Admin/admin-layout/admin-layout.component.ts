import { Component } from '@angular/core';
import { AdminMenuComponent } from "../admin-menu/admin-menu.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminMenuComponent, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {

}
