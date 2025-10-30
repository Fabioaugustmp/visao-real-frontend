import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Item } from './item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private API_URL = 'http://localhost:3000/itens'; // URL da API externa

  private itens: Item[] = [
    { id: 1, tipo: 'S', descricao: 'Serviço 1' },
    { id: 2, tipo: 'P', descricao: 'Produto 1' }
  ];

  constructor(private http: HttpClient) { }

  getItens(): Observable<Item[]> {
    // return this.http.get<Item[]>(this.API_URL);
    return of(this.itens);
  }

  getItem(id: number): Observable<Item> {
    // return this.http.get<Item>(`${this.API_URL}/${id}`);
    const item = this.itens.find(i => i.id === id);
    return of(item!)
  }

  createItem(item: Item): Observable<Item> {
    // return this.http.post<Item>(this.API_URL, item);
    item.id = this.itens.length + 1;
    this.itens.push(item);
    return of(item);
  }

  updateItem(item: Item): Observable<Item> {
    // return this.http.put<Item>(`${this.API_URL}/${item.id}`, item);
    const index = this.itens.findIndex(i => i.id === item.id);
    this.itens[index] = item;
    return of(item);
  }

  deleteItem(id: number): Observable<any> {
    // return this.http.delete(`${this.API_URL}/${id}`);
    const index = this.itens.findIndex(i => i.id === id);
    this.itens.splice(index, 1);
    return of({});
  }
}
