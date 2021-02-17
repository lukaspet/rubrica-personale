export interface Filiale {
  id: number;
  nomeFiliale: string;
  indirizzo: string;
  citta: string;
  cap: string;
  provincia: string;
  telefono: string;
  email: string;
  fax: string;
  capofilialeId: number;
  vcard: string;
}
