import { Routes } from '@angular/router';
import { ClientLayoutComponent } from './Client/client-layout/client-layout.component';
import { DashBoardComponent } from './Client/dash-board/dash-board.component';
import { MypackageComponent } from './Client/mypackage/mypackage.component';
import { AjouteColisComponent } from './Client/ajoute-colis/ajoute-colis.component';
import { AfficherLivraisonsComponent } from './Chauffeur/afficher-livraisons/afficher-livraisons.component';
import { ChauffeurLayoutComponent } from './Chauffeur/chauffeur-layout/chauffeur-layout.component';
import { MesLivraisonsComponent } from './Chauffeur/mes-livraisons/mes-livraisons.component';
import { ChauffeurDashboardComponent } from './Chauffeur/dashboard/dashboard.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { UsersComponent } from './Admin/users/users.component';
import { VehiculeComponent } from './Admin/vehicule/vehicule.component';
import { StationComponent } from './Admin/station/station.component';
import { InterventionComponent } from './Admin/intervention/intervention.component';
import { MechanicLayoutComponent } from './Mechanic/mechanic-layout/mechanic-layout.component';
import { MechanicDashboardComponent } from './Mechanic/dashboard/dashboard.component';
import { MechanicInterventionsComponent } from './Mechanic/interventions/interventions.component';
import { FactureComponent } from './Client/facture/facture.component';
import { ProblemeComponent } from './Chauffeur/probleme/probleme.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './guards/auth.guard';
import { AdminLayoutComponent } from './Admin/admin-layout/admin-layout.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'client',
    component: ClientLayoutComponent, 
    children: [
      { path: 'dashboard', component: DashBoardComponent },
      { path: 'mypackage', component: MypackageComponent },
      { path: 'ajoute-colis', component: AjouteColisComponent },
      { path: 'factures', component: FactureComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
    canActivate: [authGuard], data: { role: 'CLIENT' }
  },

  {
    path: 'deliverer',
    component: ChauffeurLayoutComponent,
    children: [
      { path: 'dashboard', component: ChauffeurDashboardComponent },
      { path: 'list-livraisons', component: AfficherLivraisonsComponent },
      { path: 'mes-livraisons', component: MesLivraisonsComponent },
      { path: 'probleme', component: ProblemeComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
    canActivate: [authGuard], data: { role: 'DRIVER' }
  },
  {
    path: 'mechanic',
    component: MechanicLayoutComponent,
    children: [
      { path: 'dashboard', component: MechanicDashboardComponent },
      { path: 'interventions', component: MechanicInterventionsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
    canActivate: [authGuard], data: { role: 'MECHANIC' }
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'vehicles', component: VehiculeComponent },
      { path: 'stations', component: StationComponent },
      { path: 'interventions', component: InterventionComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ],
    // canActivate: [authGuard], data: { role: 'ADMIN' }
  }
];
