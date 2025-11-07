import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preco } from './preco.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrecoService {

  private API_URL = `${environment.apiUrl}/precos`;

  constructor(private http: HttpClient) { }

  getPrecos(): Observable<Preco[]> {
    return this.http.get<Preco[]>(this.API_URL);
  }

  getPreco(id: number): Observable<Preco> {
    return this.http.get<Preco>(`${this.API_URL}/${id}`);
  }

  createPreco(preco: Preco): Observable<Preco> {
    return this.http.post<Preco>(this.API_URL, preco);
  }

  updatePreco(preco: Preco): Observable<Preco> {
    return this.http.put<Preco>(`${this.API_URL}/${preco.id}`, preco);
  }

  deletePreco(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}

