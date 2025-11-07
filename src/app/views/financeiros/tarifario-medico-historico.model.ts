import { Medico } from '../medicos/medico.model';
import { Bandeira } from '../bandeiras/bandeira.model';

export interface TarifarioMedicoHistorico {
  id: number;
  medico: Medico;
  bandeira: Bandeira;
  percentualTarifa: number;
  dataInicioVigencia: Date;
  dataFimVigencia: Date;
}
