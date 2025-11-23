import { Component } from '@angular/core';
import { MechanicMenuComponent } from '../mechanic-menu/mechanic-menu.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-mechanic-layout',
  standalone: true,
  imports: [MechanicMenuComponent, RouterOutlet],
  templateUrl: './mechanic-layout.component.html',
  styleUrl: './mechanic-layout.component.css'
})
export class MechanicLayoutComponent {

}

