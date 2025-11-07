import { Routes } from '@angular/router';
import { ItensTicketListComponent } from './itens-ticket-list/itens-ticket-list.component';
import { ItensTicketFormComponent } from './itens-ticket-form/itens-ticket-form.component';

export const routes: Routes = [
  {
    path: '',
    component: ItensTicketListComponent,
    data: {
      title: 'Itens do Ticket'
    }
  },
  {
    path: 'novo',
    component: ItensTicketFormComponent,
    data: {
      title: 'Novo Item do Ticket'
    }
  },
  {
    path: 'editar/:id',
    component: ItensTicketFormComponent,
    data: {
      title: 'Editar Item do Ticket'
    }
  }
];
