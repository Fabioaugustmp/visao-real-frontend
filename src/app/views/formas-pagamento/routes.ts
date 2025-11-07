import { Routes } from '@angular/router';
import { FormasPagamentoListComponent } from './formas-pagamento-list/formas-pagamento-list.component';
import { FormasPagamentoFormComponent } from './formas-pagamento-form/formas-pagamento-form.component';

export const routes: Routes = [
  {
    path: '',
    component: FormasPagamentoListComponent,
    data: {
      title: 'Formas de Pagamento'
    }
  },
  {
    path: 'nova',
    component: FormasPagamentoFormComponent,
    data: {
      title: 'Nova Forma de Pagamento'
    }
  },
  {
    path: 'editar/:id',
    component: FormasPagamentoFormComponent,
    data: {
      title: 'Editar Forma de Pagamento'
    }
  }
];
