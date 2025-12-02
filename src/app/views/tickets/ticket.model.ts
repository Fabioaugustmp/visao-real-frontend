import { Medico } from '../medicos/medico.model';
import { FormaPagamento } from '../formas-pagamento/forma-pagamento.model';
import { Bandeira } from '../bandeiras/bandeira.model';
import { Parcelamento } from '../parcelamentos/parcelamento.model';
import { ItemTicket } from '../itens-ticket/item-ticket.model';
import { Indicado } from '../indicados/indicado.model';
import { Financeiro } from '../financeiros/financeiro.model';

export interface Ticket {
  id: string;
  dataTicket: Date;
  numAtend: string;
  nomePaciente: string;
  nomePagador: string;
  cpfPagador: string;
  medicoExec: Medico;
  medicoSolic: Medico;
  percentualIndicacao?: number;
  nfSerie: string;
  nfNumero: string;
  formaPagamento: FormaPagamento;
  bandeira: Bandeira;
  bandeiraId: number;
  formaPagamentoId: number;
  medicoExecId: number,
  medicoSolicId: number,
  cartaoIdent: string;
  cartaoAutorizacao: string;
  cartaoNsu: string;
  parcelamento: Parcelamento;
  parcela: number;
  posNum: string;
  itens: ItemTicket[];
  indicados: Indicado[];
  financeiro: Financeiro;
}

// Interfaces for pagination
export interface Pageable {
  page: number;
  size: number;
  sort?: string[];
}

export interface TicketDTO {
  id: string;
  dataTicket: Date;
  numAtend: string;
  nomePaciente: string;
  nomePagador: string;
  cpfPagador: string;
  medicoExecId?: string;
  medicoExecNome?: string;
  medicoSolicId?: string;
  medicoSolicNome?: string;
  nfSerie?: string;
  nfNumero?: string;
  formaPagamentoId?: string;
  formaPagamentoDescricao?: string;
  bandeiraId?: string;
  bandeiraDescricao?: string;
  cartaoIdent?: string;
  cartaoAutorizacao?: string;
  cartaoNsu?: string;
  parcelamentoId?: string;
  posNum?: string;
  itensIds?: number[];
  indicadosIds?: number[];
  financeiroId?: string;
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

export interface PageTicketDTO {
  totalElements: number;
  totalPages: number;
  size: number;
  content: TicketDTO[];
  number: number; // Current page number (0-indexed)
  sort: SortObject;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}
