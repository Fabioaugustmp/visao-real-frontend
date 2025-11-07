import { Empresa } from '../empresas/empresa.model';
import { Usuario } from '../usuarios/usuario.model';

export interface Medico {
  id: number;
  crm: string;
  nome: string;
  dataNasc: Date;
  cpf: string;
  taxaImposto: number;
  empresa: Empresa;
  usuario: Usuario;
  email: string;
}

