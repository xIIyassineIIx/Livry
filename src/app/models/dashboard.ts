export interface DashboardDTO {
  totalClients: number;
  totalDrivers: number;
  totalMechanics: number;
  totalAdmins: number;
  totalDeliveries: number;
  delivered: number;
  pending: number;
  ongoingDeliveries: number;
  deliveriesInTransfer: number;
  totalVehicles: number;
  availableVehicles: number;
  busyVehicles: number;
  percentageVehiclesBusy: number;
  totalProblems: number;
  totalInterventions: number;
  totalStations: number;
}
