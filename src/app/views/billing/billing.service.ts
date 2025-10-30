import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PaymentMethod } from './payment-method.model';
import { Subscription } from './subscription.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  private paymentMethods: PaymentMethod[] = [
    { id: 1, userId: 1, type: 'credit-card', cardHolderName: 'Fábio', cardNumber: '**** **** **** 1234', expiryDate: '12/28', cvv: '***' },
    { id: 2, userId: 1, type: 'pix', pixKey: 'fabio@example.com' }
  ];

  private subscriptions: Subscription[] = [
    { id: 1, userId: 1, planName: 'Plano Básico', price: 29.90, startDate: new Date('2023-10-01'), endDate: new Date('2023-11-01'), status: 'active' }
  ];

  constructor() { }

  getPaymentMethods(userId: number): Observable<PaymentMethod[]> {
    return of(this.paymentMethods.filter(pm => pm.userId === userId));
  }

  addPaymentMethod(paymentMethod: PaymentMethod): Observable<PaymentMethod> {
    paymentMethod.id = this.paymentMethods.length + 1;
    this.paymentMethods.push(paymentMethod);
    return of(paymentMethod);
  }

  deletePaymentMethod(paymentMethodId: number): Observable<any> {
    const index = this.paymentMethods.findIndex(pm => pm.id === paymentMethodId);
    this.paymentMethods.splice(index, 1);
    return of({});
  }

  getSubscription(userId: number): Observable<Subscription | undefined> {
    return of(this.subscriptions.find(s => s.userId === userId && s.status === 'active'));
  }

  getAllSubscriptions(): Observable<Subscription[]> {
    return of(this.subscriptions);
  }

  cancelSubscription(subscriptionId: number): Observable<any> {
    const index = this.subscriptions.findIndex(s => s.id === subscriptionId);
    if (index !== -1) {
      this.subscriptions[index].status = 'cancelled';
    }
    return of({});
  }
}
