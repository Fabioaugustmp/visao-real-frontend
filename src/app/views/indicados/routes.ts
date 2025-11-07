import { Routes } from '@angular/router';
import { IndicadosListComponent } from './indicados-list/indicados-list.component';
import { IndicadosFormComponent } from './indicados-form/indicados-form.component';

export const routes: Routes = [
  {
    path: '',
    component: IndicadosListComponent,
    data: {
      title: 'Indicados'
    }
  },
  {
    path: 'novo',
    component: IndicadosFormComponent,
    data: {
      title: 'Novo Indicado'
    }
  },
  {
    path: 'editar/:id',
    component: IndicadosFormComponent,
    data: {
      title: 'Editar Indicado'
    }
  }
];
