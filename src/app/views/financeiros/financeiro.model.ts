import { Medico } from '../medicos/medico.model';
import { Tarifario } from '../tarifarios/tarifario.model';
import { TicketDTO } from '../tickets/ticket.model';

export interface Financeiro {
  id: number;
  ticket: TicketDTO | null;
  ticketId?: string;
  medico: Medico;
  medicoNome?: string;
  valorParcela?: number;
  totalParcelas: number;
  parcela: number;
  vencimentoData: Date;
  recebido: boolean;
  recebidoData: Date | null;
  valor: number;
  tarifarioMedicoHistorico: Tarifario;
  percentualTarifaAplicado: number;
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

export interface PageFinanceiro {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Financeiro[];
  number: number; // Current page number (0-indexed)
  sort: SortObject;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}