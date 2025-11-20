import { User } from "./user";

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  MAINTENANCE = 'MAINTENANCE'
}

export class Vehicule {

  constructor(
    public brand: string,
    public model: string,
    public plateNumber: string,
    public status: VehicleStatus,
    public driver?: Partial<User>,
    public id?: number
  ) {

  }
}
