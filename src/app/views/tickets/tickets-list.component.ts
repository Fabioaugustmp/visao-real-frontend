import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ticket, TicketDTO, PageTicketDTO, Pageable } from './ticket.model';
import { TicketService } from './ticket.service';
import { ButtonModule, CardModule, GridModule, TableModule, PaginationModule, FormModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    TableModule,
    ButtonModule,
    PaginationModule,
    FormModule,
    FormsModule
  ]
})
export class TicketsListComponent implements OnInit {

  tickets: TicketDTO[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  sort: string[] = ['id,asc'];

  searchNumAtend: string | null = null;
  searchTicketId: string | null = null;
  searchCpf: string | null = null;
  searchDataTicket: string | null = null;

  constructor(private ticketService: TicketService) { }

  ngOnInit(): void {
    this.loadTickets(this.currentPage, this.pageSize);
  }

  loadTickets(page: number, size: number): void {
    const pageable: Pageable = { page, size, sort: this.sort };
    this.ticketService.getTickets(pageable, this.searchNumAtend, this.searchTicketId, this.searchCpf, this.searchDataTicket).subscribe(
      (response: PageTicketDTO) => {
        this.tickets = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      },
      error => {
        console.error('Error loading tickets', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTickets(this.currentPage, this.pageSize);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadTickets(this.currentPage, this.pageSize);
  }

  searchTickets(): void {
    this.currentPage = 0;
    this.loadTickets(this.currentPage, this.pageSize);
  }

  clearSearch(): void {
    this.searchNumAtend = null;
    this.searchTicketId = null;
    this.searchCpf = null;
    this.searchDataTicket = null;
    this.currentPage = 0;
    this.loadTickets(this.currentPage, this.pageSize);
  }

  deleteTicket(id: string): void {
    if (confirm('Tem certeza que deseja excluir este ticket?')) {
      this.ticketService.deleteTicket(id).subscribe(() => {
        this.loadTickets(this.currentPage, this.pageSize);
      });
    }
  }
}