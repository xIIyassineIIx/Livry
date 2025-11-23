import { Region } from './region';

export type UserRole = 'ADMIN' | 'CLIENT' | 'DRIVER' | 'MECHANIC';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: UserRole;
  region?: Region | null;
  longitude?: number | null;
  latitude?: number | null;
}