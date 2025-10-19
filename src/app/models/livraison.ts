export class Livraison {
    constructor(
        public id: number,
        public chauffeurId: number,
        public clientId: number,
        public depart: string,
        public arrivee: string,
        public gouvernoratDepart: string,
        public gouvernoratArrivee: string,
        public latitudeDepart: number,
        public longitudeDepart: number,
        public details: string,
        public status: string,
        public type: string,
        public dateLivraison: Date
    ) {}
}
