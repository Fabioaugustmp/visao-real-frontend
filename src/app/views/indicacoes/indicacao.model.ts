import { Medico } from '../medicos/medico.model';

export interface Indicacao {
  id: number;
  medico: Medico;
  tipo: string;
  valorIndicacao: number;
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

export interface PageIndicacao {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Indicacao[];
  number: number; // Current page number (0-indexed)
  sort: SortObject;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}