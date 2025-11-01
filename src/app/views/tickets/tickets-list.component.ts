import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ticket } from './ticket.model';
import { TicketService } from './ticket.service';
import { ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, GridModule, TableModule, ButtonModule]
})
export class TicketsListComponent implements OnInit {

  tickets: Ticket[] = [];

  constructor(private ticketService: TicketService) { }

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getTickets().subscribe(tickets => {
      this.tickets = tickets;
    });
  }

  deleteTicket(id: string): void {
    if (confirm('Tem certeza que deseja excluir este ticket?')) {
      this.ticketService.deleteTicket(id).subscribe(() => {
        this.loadTickets();
      });
    }
  }
}