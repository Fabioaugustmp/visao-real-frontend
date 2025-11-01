import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ticket } from './ticket.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private API_URL = `${environment.apiUrl}/tickets`;

  constructor(private http: HttpClient) { }

  getTickets(): Observable<Ticket[]> {
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