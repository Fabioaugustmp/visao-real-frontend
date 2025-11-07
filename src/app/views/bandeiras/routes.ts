import { Routes } from '@angular/router';
import { BandeirasListComponent } from './bandeiras-list/bandeiras-list.component';
import { BandeirasFormComponent } from './bandeiras-form/bandeiras-form.component';

export const routes: Routes = [
  {
    path: '',
    component: BandeirasListComponent,
    data: {
      title: 'Bandeiras'
    }
  },
  {
    path: 'nova',
    component: BandeirasFormComponent,
    data: {
      title: 'Nova Bandeira'
    }
  },
  {
    path: 'editar/:id',
    component: BandeirasFormComponent,
    data: {
      title: 'Editar Bandeira'
    }
  }
];
