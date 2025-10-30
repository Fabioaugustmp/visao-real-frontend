import { Routes } from '@angular/router';
import { BillingComponent } from './billing.component';
import { AddCreditCardComponent } from './add-credit-card/add-credit-card.component';
import { AddPixComponent } from './add-pix/add-pix.component';

export const BILLING_ROUTES: Routes = [
  {
    path: '',
    component: BillingComponent,
    data: {
      title: 'Faturamento'
    }
  },
  {
    path: 'add-credit-card',
    component: AddCreditCardComponent,
    data: {
      title: 'Adicionar Cartão de Crédito'
    }
  },
  {
    path: 'add-pix',
    component: AddPixComponent,
    data: {
      title: 'Adicionar Chave PIX'
    }
  }
];
