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
  nfSerie: string;
  nfNumero: string;
  formaPagamento: FormaPagamento;
  bandeira: Bandeira;
  cartaoIdent: string;
  cartaoCvv: string;
  cartaoAutorizacao: string;
  cartaoNsu: string;
  parcelamento: Parcelamento;
  posNum: string;
  itens: ItemTicket[];
  indicados: Indicado[];
  financeiro: Financeiro;
}