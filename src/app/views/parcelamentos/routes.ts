import { Routes } from '@angular/router';
import { ParcelamentosListComponent } from './parcelamentos-list/parcelamentos-list.component';
import { ParcelamentosFormComponent } from './parcelamentos-form/parcelamentos-form.component';

export const routes: Routes = [
  {
    path: '',
    component: ParcelamentosListComponent,
    data: {
      title: 'Parcelamentos'
    }
  },
  {
    path: 'novo',
    component: ParcelamentosFormComponent,
    data: {
      title: 'Novo Parcelamento'
    }
  },
  {
    path: 'editar/:id',
    component: ParcelamentosFormComponent,
    data: {
      title: 'Editar Parcelamento'
    }
  }
];
