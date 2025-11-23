import { Livraison } from './livraison';
import { User } from './user';

export enum ProblemType {
  DELIVERY_DELAY = 'DELIVERY_DELAY',
  ACCIDENT = 'ACCIDENT',
  CLIENT_UNREACHABLE = 'CLIENT_UNREACHABLE',
  NON_DELIVERED = 'NON_DELIVERED',
  DAMAGED_PACKAGE = 'DAMAGED_PACKAGE',
  OTHER = 'OTHER'
}

export enum ProblemStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export interface Problem {
  id?: number;
  type: ProblemType;
  description: string;
  status?: ProblemStatus;
  delivery?: Livraison;
  createdBy?: User;
  createdAt?: string;
}