import { Routes } from '@angular/router';
import { MedicosListComponent } from './medicos-list/medicos-list.component';
import { MedicosFormComponent } from './medicos-form/medicos-form.component';

export const MEDICO_ROUTES: Routes = [
  {
    path: '',
    component: MedicosListComponent,
    data: {
      title: 'Médicos'
    }
  },
  {
    path: 'novo',
    component: MedicosFormComponent,
    data: {
      title: 'Novo Médico'
    }
  },
  {
    path: 'editar/:id',
    component: MedicosFormComponent,
    data: {
      title: 'Editar Médico'
    }
  }
];
