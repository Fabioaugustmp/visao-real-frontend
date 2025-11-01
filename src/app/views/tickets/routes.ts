import { Routes } from '@angular/router';
import { TicketsListComponent } from './tickets-list.component';
import { TicketsFormComponent } from './tickets-form/tickets-form.component';

export const TICKET_ROUTES: Routes = [
  {
    path: '',
    component: TicketsListComponent,
    data: {
      title: 'Tickets'
    }
  },
  {
    path: 'novo',
    component: TicketsFormComponent,
    data: {
      title: 'Novo Ticket'
    }
  },
  {
    path: 'editar/:id',
    component: TicketsFormComponent,
    data: {
      title: 'Editar Ticket'
    }
  }
];
