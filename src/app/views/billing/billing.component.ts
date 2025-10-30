import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BillingService } from './billing.service';
import { PaymentMethod } from './payment-method.model';
import { Subscription } from './subscription.model';
import { BadgeModule, ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, GridModule, TableModule, ButtonModule, BadgeModule]
})
export class BillingComponent implements OnInit {

  paymentMethods: PaymentMethod[] = [];
  subscription: Subscription | undefined;
  userId = 1; // Hardcoded user ID for now

  constructor(private billingService: BillingService) { }

  ngOnInit(): void {
    this.loadPaymentMethods();
    this.loadSubscription();
  }

  loadPaymentMethods(): void {
    this.billingService.getPaymentMethods(this.userId).subscribe(pms => {
      this.paymentMethods = pms;
    });
  }

  loadSubscription(): void {
    this.billingService.getSubscription(this.userId).subscribe(sub => {
      this.subscription = sub;
    });
  }

  deletePaymentMethod(id: number): void {
    if (confirm('Tem certeza que deseja remover este método de pagamento?')) {
      this.billingService.deletePaymentMethod(id).subscribe(() => {
        this.loadPaymentMethods();
      });
    }
  }

  cancelSubscription(): void {
    if (this.subscription && confirm('Tem certeza que deseja cancelar sua assinatura?')) {
      this.billingService.cancelSubscription(this.subscription.id).subscribe(() => {
        this.loadSubscription();
      });
    }
  }
}
