import { Medico } from '../medicos/medico.model';

export interface Financeiro {
  id: number;
  ticket: any;
  medico: Medico;
  totalParcelas: number;
  parcela: number;
  venctoData: Date;
  recebido: boolean;
  recebidoData: Date;
  valor: number;
  tarifaAplicada: number;
}