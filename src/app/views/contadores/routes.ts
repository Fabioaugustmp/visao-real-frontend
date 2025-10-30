import { Routes } from '@angular/router';
import { ContadoresListComponent } from './contadores-list/contadores-list.component';
import { ContadoresFormComponent } from './contadores-form/contadores-form.component';

export const CONTADOR_ROUTES: Routes = [
  {
    path: '',
    component: ContadoresListComponent,
    data: {
      title: 'Contadores'
    }
  },
  {
    path: 'novo',
    component: ContadoresFormComponent,
    data: {
      title: 'Novo Contador'
    }
  },
  {
    path: 'editar/:id',
    component: ContadoresFormComponent,
    data: {
      title: 'Editar Contador'
    }
  }
];
