import { Routes } from '@angular/router';
import { IndicacoesListComponent } from './indicacoes-list/indicacoes-list.component';
import { IndicacoesFormComponent } from './indicacoes-form/indicacoes-form.component';

export const routes: Routes = [
  {
    path: '',
    component: IndicacoesListComponent,
    data: {
      title: 'Indicações'
    }
  },
  {
    path: 'novo',
    component: IndicacoesFormComponent,
    data: {
      title: 'Nova Indicação'
    }
  },
  {
    path: 'editar/:id',
    component: IndicacoesFormComponent,
    data: {
      title: 'Editar Indicação'
    }
  }
];
