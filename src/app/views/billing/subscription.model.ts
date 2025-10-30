export interface Subscription {
  id: number;
  userId: number;
  planName: string;
  price: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'inactive' | 'cancelled';
}
