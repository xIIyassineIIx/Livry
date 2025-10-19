import { Routes } from '@angular/router';
import { CommandeClientComponent } from './Client/commande-client/commande-client.component';
import { DashBoardComponent } from './Client/dash-board/dash-board.component';
import { MypackageComponent } from './Client/mypackage/mypackage.component';
import { AjouteColisComponent } from './Client/ajoute-colis/ajoute-colis.component';
import { AfficherLivraisonsComponent } from './Chauffeur/afficher-livraisons/afficher-livraisons.component';


export const routes: Routes = [
    
    {
        path: 'CommandeClient',
        component: CommandeClientComponent
    },
{
        path: 'dashboard-client',
        component: DashBoardComponent
    }
     ,{
        path: 'mypackage',
        component: MypackageComponent
    },
    {
        path: 'ajoute-colis',
        component: AjouteColisComponent
    },
    {
        path: 'afficher-livraisons',
        component: AfficherLivraisonsComponent
    }
];
