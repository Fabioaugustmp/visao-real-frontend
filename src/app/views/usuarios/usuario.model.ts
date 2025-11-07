import { Perfil } from './perfil.model';

export interface Usuario {
  id: number;
  nome: string;
  login: string;
  email: string;
  perfis: Perfil[];
  password?: string;
  dataCriacao: Date;
  status: boolean;
}

