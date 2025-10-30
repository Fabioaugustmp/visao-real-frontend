import { Routes } from '@angular/router';
import { PrecosListComponent } from './precos-list/precos-list.component';
import { PrecosFormComponent } from './precos-form/precos-form.component';

export const PRECO_ROUTES: Routes = [
  {
    path: '',
    component: PrecosListComponent,
    data: {
      title: 'Preços'
    }
  },
  {
    path: 'novo',
    component: PrecosFormComponent,
    data: {
      title: 'Novo Preço'
    }
  },
  {
    path: 'editar/:id',
    component: PrecosFormComponent,
    data: {
      title: 'Editar Preço'
    }
  }
];
