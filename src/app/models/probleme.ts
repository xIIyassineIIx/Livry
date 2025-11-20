import { User } from './user';
import { Livraison } from './livraison';

export enum ProblemType {
  LATE = 'LATE',
  BREAKDOWN = 'BREAKDOWN',
  ACCIDENT = 'ACCIDENT',
  OTHER = 'OTHER'
}

export interface Problem {
  id?: number;
  type: ProblemType;
  description: string;
  delivery?: Partial<Livraison>;
  driver?: Partial<User>;
  resolved?: boolean;
}