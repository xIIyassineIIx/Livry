import { Component, OnInit } from '@angular/core';
import { LivraisonService } from '../../services/livraison.service';
import { DashboardDTO } from '../../models/dashboard';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  dashboardData: DashboardDTO = {
      totalClients: 0,
      totalDrivers: 0,
      totalMechanics: 0,
      totalAdmins: 0,
      totalDeliveries: 0,
      delivered: 0,
      pending: 0,
      totalVehicles: 0,
      totalProblems: 0
  };

  constructor(private dashboardService: AdminService) { }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {
    this.dashboardService.getDashboard().subscribe(data => {
      this.dashboardData = data;
      console.log(this.dashboardData);
    });
  }
}
