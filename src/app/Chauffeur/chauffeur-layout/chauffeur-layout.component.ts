import { Component } from '@angular/core';
import { ChauffeurMenuComponent } from "../chauffeur-menu/chauffeur-menu.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-chauffeur-layout',
  standalone: true,
  imports: [ChauffeurMenuComponent, RouterOutlet],
  templateUrl: './chauffeur-layout.component.html',
  styleUrl: './chauffeur-layout.component.css'
})
export class ChauffeurLayoutComponent {

}
