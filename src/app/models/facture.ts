import { User } from './user';
import { Livraison } from './livraison';

export interface Facture {
  id?: number;
  reference?: string;
  montant: number;
  client?: User;
  delivery?: Livraison;
}

