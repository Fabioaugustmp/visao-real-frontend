import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from './item.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private API_URL = `${environment.apiUrl}/itens`;

  constructor(private http: HttpClient) { }

  getItens(): Observable<Item[]> {
    return this.http.get<Item[]>(this.API_URL);
  }

  getItem(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.API_URL}/${id}`);
  }

  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.API_URL, item);
  }

  updateItem(item: Item): Observable<Item> {
    return this.http.put<Item>(`${this.API_URL}/${item.id}`, item);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
