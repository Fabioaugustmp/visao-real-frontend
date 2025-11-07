import { Routes } from '@angular/router';
import { FinanceirosListComponent } from './financeiros-list/financeiros-list.component';
import { FinanceirosFormComponent } from './financeiros-form/financeiros-form.component';

export const routes: Routes = [
  {
    path: '',
    component: FinanceirosListComponent,
    data: {
      title: 'Financeiros'
    }
  },
  {
    path: 'novo',
    component: FinanceirosFormComponent,
    data: {
      title: 'Novo Financeiro'
    }
  },
  {
    path: 'editar/:id',
    component: FinanceirosFormComponent,
    data: {
      title: 'Editar Financeiro'
    }
  }
];
