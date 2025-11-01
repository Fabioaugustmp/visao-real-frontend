import { Medico } from '../medicos/medico.model';

export interface Indicacao {
  id: number;
  medico: Medico;
  tipo: string;
  valorIndicacao: number;
}