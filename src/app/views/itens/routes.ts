import { Routes } from '@angular/router';
import { ItensListComponent } from './itens-list/itens-list.component';
import { ItensFormComponent } from './itens-form/itens-form.component';

export const ITEM_ROUTES: Routes = [
  {
    path: '',
    component: ItensListComponent,
    data: {
      title: 'Itens'
    }
  },
  {
    path: 'novo',
    component: ItensFormComponent,
    data: {
      title: 'Novo Item'
    }
  },
  {
    path: 'editar/:id',
    component: ItensFormComponent,
    data: {
      title: 'Editar Item'
    }
  }
];
