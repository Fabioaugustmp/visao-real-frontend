export interface DetalheAtendimentoDTO {
  idTicket: string;
  dataAtendimento: string; // date-time
  nomePaciente: string;
  valorAtendimento: number;
}

export interface RelatorioMedicoDTO {
  nomeMedico: string;
  dataInicio: string; // date
  dataFim: string; // date
  totalAtendimentos: number;
  valorTotalFaturado: number;
  detalhes: DetalheAtendimentoDTO[];
}
