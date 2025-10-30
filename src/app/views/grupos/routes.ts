import { Routes } from '@angular/router';
import { GruposListComponent } from './grupos-list/grupos-list.component';
import { GruposFormComponent } from './grupos-form/grupos-form.component';

export const GRUPO_ROUTES: Routes = [
  {
    path: '',
    component: GruposListComponent,
    data: {
      title: 'Grupos'
    }
  },
  {
    path: 'novo',
    component: GruposFormComponent,
    data: {
      title: 'Novo Grupo'
    }
  },
  {
    path: 'editar/:id',
    component: GruposFormComponent,
    data: {
      title: 'Editar Grupo'
    }
  }
];
