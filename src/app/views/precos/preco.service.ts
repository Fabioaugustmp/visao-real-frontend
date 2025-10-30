import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Preco } from './preco.model';

@Injectable({
  providedIn: 'root'
})
export class PrecoService {

  private API_URL = 'http://localhost:3000/precos'; // URL da API externa

  private precos: Preco[] = [
    { id: 1, id_item: 1, valor: 100.50 },
    { id: 2, id_item: 2, valor: 50.00 }
  ];

  constructor(private http: HttpClient) { }

  getPrecos(): Observable<Preco[]> {
    // return this.http.get<Preco[]>(this.API_URL);
    return of(this.precos);
  }

  getPreco(id: number): Observable<Preco> {
    // return this.http.get<Preco>(`${this.API_URL}/${id}`);
    const preco = this.precos.find(p => p.id === id);
    return of(preco!)
  }

  createPreco(preco: Preco): Observable<Preco> {
    // return this.http.post<Preco>(this.API_URL, preco);
    preco.id = this.precos.length + 1;
    this.precos.push(preco);
    return of(preco);
  }

  updatePreco(preco: Preco): Observable<Preco> {
    // return this.http.put<Preco>(`${this.API_URL}/${preco.id}`, preco);
    const index = this.precos.findIndex(p => p.id === preco.id);
    this.precos[index] = preco;
    return of(preco);
  }

  deletePreco(id: number): Observable<any> {
    // return this.http.delete(`${this.API_URL}/${id}`);
    const index = this.precos.findIndex(p => p.id === id);
    this.precos.splice(index, 1);
    return of({});
  }
}
