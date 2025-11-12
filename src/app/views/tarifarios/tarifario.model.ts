import { Medico } from '../medicos/medico.model';
import { Bandeira } from '../bandeiras/bandeira.model';

export interface Tarifario {
  id: number;
  medico: Medico;
  bandeira: Bandeira;
  titulo: string;
  percentualTarifa: number;
  dataInicioVigencia: Date;
  dataFimVigencia: Date;
}
