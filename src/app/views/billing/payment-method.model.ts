export interface PaymentMethod {
  id: number;
  userId: number;
  type: 'credit-card' | 'pix';
  cardHolderName?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  pixKey?: string;
}
