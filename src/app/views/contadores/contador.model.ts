import { Empresa } from '../empresas/empresa.model';

export interface Contador {
  id: number;
  nome: string;
  email: string;
  crc: string;
  crcUf: string;
  empresaId?: number;
  empresa?: Empresa;
}
