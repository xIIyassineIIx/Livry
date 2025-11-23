import { Region } from './region';

export interface Address {
  number?: string;
  street: string;
  city: string;
  region: Region;
  postalCode?: string;
}



