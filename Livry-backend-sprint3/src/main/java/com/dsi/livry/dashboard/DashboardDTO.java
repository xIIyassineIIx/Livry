package com.dsi.livry.dashboard;

public class DashboardDTO {

    // Users
    private long totalClients;
    private long totalDrivers;
    private long totalMechanics;
    private long totalAdmins;

    // Deliveries
    private long totalDeliveries;
    private long delivered;
    private long pending;
    private long ongoingDeliveries;
    private long deliveriesInTransfer;

    // Vehicles
    private long totalVehicles;
    private long availableVehicles;
    private long busyVehicles;
    private double percentageVehiclesBusy;

    // Problems & Interventions
    private long totalProblems;
    private long totalInterventions;

    // Stations
    private long totalStations;


    public long getTotalClients() { return totalClients; }
    public void setTotalClients(long totalClients) { this.totalClients = totalClients; }

    public long getTotalDrivers() { return totalDrivers; }
    public void setTotalDrivers(long totalDrivers) { this.totalDrivers = totalDrivers; }

    public long getTotalMechanics() { return totalMechanics; }
    public void setTotalMechanics(long totalMechanics) { this.totalMechanics = totalMechanics; }

    public long getTotalAdmins() { return totalAdmins; }
    public void setTotalAdmins(long totalAdmins) { this.totalAdmins = totalAdmins; }

    public long getTotalDeliveries() { return totalDeliveries; }
    public void setTotalDeliveries(long totalDeliveries) { this.totalDeliveries = totalDeliveries; }

    public long getDelivered() { return delivered; }
    public void setDelivered(long delivered) { this.delivered = delivered; }

    public long getPending() { return pending; }
    public void setPending(long pending) { this.pending = pending; }

    public long getOngoingDeliveries() { return ongoingDeliveries; }
    public void setOngoingDeliveries(long ongoingDeliveries) { this.ongoingDeliveries = ongoingDeliveries; }

    public long getDeliveriesInTransfer() { return deliveriesInTransfer; }
    public void setDeliveriesInTransfer(long deliveriesInTransfer) { this.deliveriesInTransfer = deliveriesInTransfer; }

    public long getTotalVehicles() { return totalVehicles; }
    public void setTotalVehicles(long totalVehicles) { this.totalVehicles = totalVehicles; }

    public long getAvailableVehicles() { return availableVehicles; }
    public void setAvailableVehicles(long availableVehicles) { this.availableVehicles = availableVehicles; }

    public long getBusyVehicles() { return busyVehicles; }
    public void setBusyVehicles(long busyVehicles) { this.busyVehicles = busyVehicles; }

    public double getPercentageVehiclesBusy() { return percentageVehiclesBusy; }
    public void setPercentageVehiclesBusy(double percentageVehiclesBusy) { this.percentageVehiclesBusy = percentageVehiclesBusy; }

    public long getTotalProblems() { return totalProblems; }
    public void setTotalProblems(long totalProblems) { this.totalProblems = totalProblems; }

    public long getTotalInterventions() { return totalInterventions; }
    public void setTotalInterventions(long totalInterventions) { this.totalInterventions = totalInterventions; }

    public long getTotalStations() { return totalStations; }
    public void setTotalStations(long totalStations) { this.totalStations = totalStations; }
}
