export enum TipoPerfil {
  ADMINISTRADOR = 'ADMINISTRADOR',
  GESTOR = 'GESTOR',
  MEDICO = 'MEDICO',
  SIS_ADMIN = 'SIS_ADMIN'
}

export interface Perfil {
  id: number;
  nome: string;
  tipo: TipoPerfil;
}
