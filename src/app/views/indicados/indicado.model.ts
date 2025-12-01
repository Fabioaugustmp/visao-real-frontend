import { Indicacao } from '../indicacoes/indicacao.model';
import { Medico } from '../medicos/medico.model';

export interface Indicado {
  id: number;
  ticket: any;
  indicacao: Indicacao;
  medicoIndicador?: Medico;  // The doctor who is referring
  medicoIndicado?: any;   // The doctor being referred
  venctoIndicacao: Date;
  totalParcelas: number;
  parcela: number;
  valorIndicacao: number;
  pago: boolean;
  pagoData: Date;
  recebido: boolean;
  recebidoData: Date;
}

// Pagination interfaces
export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface PageableObject {
  offset: number;
  sort: SortObject;
  paged: boolean;
  pageSize: number;
  pageNumber: number;
  unpaged: boolean;
}

export interface PageIndicado {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Indicado[];
  number: number; // Current page number (0-indexed)
  sort: SortObject;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}