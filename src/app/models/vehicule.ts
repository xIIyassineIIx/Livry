import { User } from './user';
import { StationSummary } from './livraison';

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  UNDER_REPAIR = 'UNDER_REPAIR'
}

export interface Vehicule {
  id?: number;
  brand: string;
  model: string;
  plateNumber: string;
  status: VehicleStatus;
  driver?: Partial<User> | null;
  station?: StationSummary | null;
}
