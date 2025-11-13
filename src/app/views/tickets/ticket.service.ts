import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket, PageTicketDTO, Pageable } from './ticket.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private API_URL = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) { }

  // Modified to support pagination and search filters
  getTickets(
    pageable: Pageable,
    medicoId: number | null = null,
    ticketId: string | null = null,
    cpf: string | null = null
  ): Observable<PageTicketDTO> {
    let params = new HttpParams();
    if (pageable.page !== undefined && pageable.page !== null) {
      params = params.append('page', pageable.page.toString());
    }
    if (pageable.size !== undefined && pageable.size !== null) {
      params = params.append('size', pageable.size.toString());
    }
    if (pageable.sort && pageable.sort.length > 0) {
      pageable.sort.forEach(s => {
        params = params.append('sort', s);
      });
    }

    if (medicoId !== null) {
      params = params.append('medicoId', medicoId.toString());
    }
    if (ticketId !== null) {
      params = params.append('ticketId', ticketId);
    }
    if (cpf !== null) {
      params = params.append('cpf', cpf);
    }

    return this.http.get<PageTicketDTO>(this.API_URL, { params });
  }

  // New method to get all tickets without pagination
  getAllTicketsWithoutPagination(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.API_URL);
  }

  getTicket(id: string): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.API_URL}/${id}`);
  }

  createTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(this.API_URL, ticket);
  }

  updateTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.API_URL}/${ticket.id}`, ticket);
  }

  deleteTicket(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}