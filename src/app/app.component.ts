import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClientMenuComponent } from "./Client/client-menu/client-menu.component";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ClientMenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Livry';
}
