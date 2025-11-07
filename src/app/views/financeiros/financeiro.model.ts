import { Medico } from '../medicos/medico.model';
import { TarifarioMedicoHistorico } from './tarifario-medico-historico.model';

export interface Financeiro {
  id: number;
  ticket: any;
  medico: Medico;
  totalParcelas: number;
  parcela: number;
  vencimentoData: Date;
  recebido: boolean;
  recebidoData: Date;
  valor: number;
  tarifarioMedicoHistorico: TarifarioMedicoHistorico;
  percentualTarifaAplicado: number;
}