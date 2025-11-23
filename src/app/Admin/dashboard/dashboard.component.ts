import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DashboardDTO } from '../../models/dashboard';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
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
    ongoingDeliveries: 0,
    deliveriesInTransfer: 0,
    totalVehicles: 0,
    availableVehicles: 0,
    busyVehicles: 0,
    percentageVehiclesBusy: 0,
    totalProblems: 0,
    totalInterventions: 0,
    totalStations: 0
  };

  constructor(private dashboardService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.dashboardService.getDashboard().subscribe((data) => {
      this.dashboardData = data;
    });
  }
}
