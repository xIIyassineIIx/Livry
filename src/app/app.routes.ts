import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './Client/client-layout/client-layout.component';
import { DashBoardComponent } from './Client/dash-board/dash-board.component';
import { MypackageComponent } from './Client/mypackage/mypackage.component';
import { AjouteColisComponent } from './Client/ajoute-colis/ajoute-colis.component';
import { AfficherLivraisonsComponent } from './Chauffeur/afficher-livraisons/afficher-livraisons.component';
import { ChauffeurLayoutComponent } from './Chauffeur/chauffeur-layout/chauffeur-layout.component';
import { MesLivraisonsComponent } from './Chauffeur/mes-livraisons/mes-livraisons.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { UsersComponent } from './Admin/users/users.component';
import { VehiculeComponent } from './Admin/vehicule/vehicule.component';
import { ProblemeComponent } from './Chauffeur/probleme/probleme.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './Admin/admin-layout/admin-layout.component';

export const routes: Routes = [

  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'client',
    component: ClientLayoutComponent, 
    children: [
      { path: 'dashboard', component: DashBoardComponent },
      { path: 'mypackage', component: MypackageComponent },
      { path: 'ajoute-colis', component: AjouteColisComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
    canActivate: [authGuard], data: { role: 'CLIENT' }
  },

  {
    path: 'deliverer',
    component: ChauffeurLayoutComponent,
    children: [
      { path: 'list-livraisons', component: AfficherLivraisonsComponent },
      { path: 'mes-livraisons', component: MesLivraisonsComponent },
      { path: 'probleme', component: ProblemeComponent },
       
    ],
    canActivate: [authGuard], data: { role: 'DRIVER' }
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'vehicles', component: VehiculeComponent },
       
    ],
    canActivate: [authGuard], data: { role: 'ADMIN' }
  },
  

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
