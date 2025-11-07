import { Routes } from '@angular/router';
import { TarifariosListComponent } from './tarifarios-list/tarifarios-list.component';
import { TarifariosFormComponent } from './tarifarios-form/tarifarios-form.component';

export const routes: Routes = [
  {
    path: '',
    component: TarifariosListComponent,
    data: {
      title: 'Tarifários'
    }
  },
  {
    path: 'novo',
    component: TarifariosFormComponent,
    data: {
      title: 'Novo Tarifário'
    }
  },
  {
    path: 'editar/:id',
    component: TarifariosFormComponent,
    data: {
      title: 'Editar Tarifário'
    }
  }
];
