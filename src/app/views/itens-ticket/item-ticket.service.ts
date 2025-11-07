import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemTicket } from './item-ticket.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemTicketService {

  private API_URL = `${environment.apiUrl}/itens_ticket`;

  constructor(private http: HttpClient) { }

  getItemTickets(): Observable<ItemTicket[]> {
    return this.http.get<ItemTicket[]>(this.API_URL);
  }

  getItemTicket(id: number): Observable<ItemTicket> {
    return this.http.get<ItemTicket>(`${this.API_URL}/${id}`);
  }

  createItemTicket(itemTicket: ItemTicket): Observable<ItemTicket> {
    return this.http.post<ItemTicket>(this.API_URL, itemTicket);
  }

  updateItemTicket(itemTicket: ItemTicket): Observable<ItemTicket> {
    return this.http.put<ItemTicket>(`${this.API_URL}/${itemTicket.id}`, itemTicket);
  }

  deleteItemTicket(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}