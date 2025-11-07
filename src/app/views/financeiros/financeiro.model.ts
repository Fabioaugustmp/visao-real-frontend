import { Medico } from '../medicos/medico.model';
import { Tarifario } from '../tarifarios/tarifario.model';

export interface Financeiro {
  id: number;
  ticket: any;
  medico: Medico;
  totalParcelas: number;
  parcela: number;
  vencimentoData: Date;
  recebido: boolean;
  recebidoData: Date | null;
  valor: number;
  tarifarioMedicoHistorico: TarifarioMedicoHistorico;
  percentualTarifaAplicado: number;
}

export interface TarifarioMedicoHistorico {
  id: number;
  // TODO: Define other properties for TarifarioMedicoHistorico
}