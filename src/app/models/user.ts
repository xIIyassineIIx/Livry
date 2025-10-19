export class User {
    constructor(
    public id: number,
    public nom: string,
    public prenom: string,
    public email: string,
    public role: 'CLIENT' | 'CHAUFFEUR',
    public gouvernorat: string,
    public latitude: number,
    public longitude: number
  ) {}
}
