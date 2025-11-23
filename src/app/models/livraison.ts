import { Address } from './address';
import { Region } from './region';
import { User } from './user';

export enum DeliveryStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  IN_TRANSIT = 'IN_TRANSIT',
  DRIVER_TRANSFER = 'DRIVER_TRANSFER',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export enum DeliveryType {
  DOCUMENT = 'DOCUMENT',
  FRAGILE = 'FRAGILE',
  FOOD = 'FOOD',
  OTHER = 'OTHER'
}

export interface StationSummary {
  id?: number;
  name?: string;
  region?: Region;
}

export interface Livraison {
  id?: number;
  description: string;
  type: DeliveryType;
  status?: DeliveryStatus;
  client?: User;
  driver?: User | null;
  station?: StationSummary | null;
  departureAddress: Address;
  arrivalAddress: Address;
  createdAt?: string;
}
