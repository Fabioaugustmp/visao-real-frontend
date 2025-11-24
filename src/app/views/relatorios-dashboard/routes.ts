import { Routes } from '@angular/router';

import { RelatoriosDashboardComponent } from './relatorios-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: RelatoriosDashboardComponent,
    data: {
      title: 'Relatório Detalhado'
    }
  }
];