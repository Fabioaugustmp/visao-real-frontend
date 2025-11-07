import { Contador } from '../contadores/contador.model';

export interface Empresa {
  id: number;
  cnpj: string;
  razaoSocial: string;
  idContratoCartao: number;
  contador: Contador;
}

