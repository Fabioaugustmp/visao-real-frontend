export enum NomeFormaPagamento {
  PIX = "Pix - Pagamento instantâneo entre contas",
  CARTAO_CREDITO = "Cartão de crédito",
  CARTAO_DEBITO = "Cartão de débito",
  BOLETO_BANCARIO = "Boleto bancário",
  DINHEIRO = "Dinheiro em espécie",
  CARTEIRA_DIGITAL = "Carteira digital (ex: PicPay, Mercado Pago)",
  TRANSFERENCIA_BANCARIA = "Transferência bancária (TED/DOC)",
  VALE_REFEICAO = "Vale-refeição",
  VALE_ALIMENTACAO = "Vale-alimentação",
  PAYPAL = "PayPal - Pagamento online",
  LINK_PAGAMENTO = "Link de pagamento",
  QR_CODE = "Pagamento via QR Code",
  CARTAO_PRE_PAGO = "Cartão pré-pago recarregável",
  CHEQUE = "Cheque tradicional"
}

export interface FormaPagamento {
  id: number;
  nome: NomeFormaPagamento;
  descricao: string;
  idParcelamento: number;
}