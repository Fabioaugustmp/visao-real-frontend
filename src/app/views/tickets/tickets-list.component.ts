import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Ticket, TicketDTO, PageTicketDTO, Pageable } from './ticket.model'; // Import TicketDTO, PageTicketDTO, Pageable
import { TicketService } from './ticket.service';
import { ButtonModule, CardModule, GridModule, TableModule, PaginationModule } from '@coreui/angular'; // Re-added SmartPaginationComponent

@Component({
  selector: 'app-tickets-list',
  templateUrl: './tickets-list.component.html',
  styleUrls: ['./tickets-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, GridModule, TableModule, ButtonModule, PaginationModule] // Re-added SmartPaginationComponent to imports
})
export class TicketsListComponent implements OnInit {

  tickets: TicketDTO[] = []; // Change to TicketDTO[]
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  sort: string[] = ['id,asc']; // Default sort

  constructor(private ticketService: TicketService) { }

  ngOnInit(): void {
    this.loadTickets(this.currentPage, this.pageSize);
  }

  loadTickets(page: number, size: number): void {
    const pageable: Pageable = { page, size, sort: this.sort };
    this.ticketService.getTickets(pageable).subscribe(
      (response: PageTicketDTO) => {
        this.tickets = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number; // API returns 0-indexed page number
      },
      error => {
        console.error('Error loading tickets', error);
        // NotificationService will handle toast display
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page; // Revert to direct assignment
    this.loadTickets(this.currentPage, this.pageSize);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0; // Reset to first page when page size changes
    this.loadTickets(this.currentPage, this.pageSize);
  }

  deleteTicket(id: string): void {
    if (confirm('Tem certeza que deseja excluir este ticket?')) {
      this.ticketService.deleteTicket(id).subscribe(() => {
        this.loadTickets(this.currentPage, this.pageSize); // Reload current page after deletion
      });
    }
  }
}