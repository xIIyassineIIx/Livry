import { User } from './user';
import { Vehicule } from './vehicule';
import { Station } from './station';

export enum InterventionType {
  MAINTENANCE = 'MAINTENANCE',
  REPARATION = 'REPARATION',
  INSPECTION = 'INSPECTION',
  NETTOYAGE = 'NETTOYAGE'
}

export enum InterventionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface Intervention {
  id?: number;
  type?: InterventionType;
  descriptionRequest: string;
  descriptionDone?: string;
  status?: InterventionStatus;
  mechanic?: User | null;
  vehicle?: Vehicule | null;
  station?: Station | null;
  createdAt?: string;
  completionDate?: string;
}

