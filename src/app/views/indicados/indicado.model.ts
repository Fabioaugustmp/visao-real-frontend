import { Indicacao } from '../indicacoes/indicacao.model';

export interface Indicado {
  id: number;
  ticket: any;
  indicacao: Indicacao;
  venctoIndicacao: Date;
  totalParcelas: number;
  parcela: number;
  valorIndicacao: number;
  pago: boolean;
  pagoData: Date;
  recebido: boolean;
  recebidoData: Date;
}