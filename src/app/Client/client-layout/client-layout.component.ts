import { Component } from '@angular/core';
import { ClientMenuComponent } from "../client-menu/client-menu.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [ClientMenuComponent, RouterOutlet],
  templateUrl: './client-layout.component.html',
  styleUrl: './client-layout.component.css'
})
export class ClientLayoutComponent {

}
