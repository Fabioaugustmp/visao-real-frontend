import { Routes } from '@angular/router';
import { EmpresasListComponent } from './empresas-list/empresas-list.component';
import { EmpresasFormComponent } from './empresas-form/empresas-form.component';

export const EMPRESA_ROUTES: Routes = [
  {
    path: '',
    component: EmpresasListComponent,
    data: {
      title: 'Empresas'
    }
  },
  {
    path: 'nova',
    component: EmpresasFormComponent,
    data: {
      title: 'Nova Empresa'
    }
  },
  {
    path: 'editar/:id',
    component: EmpresasFormComponent,
    data: {
      title: 'Editar Empresa'
    }
  }
];
