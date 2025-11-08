export interface Bandeira {
  id: number;
  bandeira: string;
}

export enum BandeiraEnum {
  VISA = 'VISA',
  MASTERCARD = 'MASTERCARD',
  ELO = 'ELO',
  AMEX = 'AMEX',
  HIPERCARD = 'HIPERCARD',
  DINERS = 'DINERS',
  DISCOVER = 'DISCOVER',
  JCB = 'JCB',
  AURA = 'AURA',
  SOROCRED = 'SOROCRED',
  OUTROS = 'OUTROS'
}