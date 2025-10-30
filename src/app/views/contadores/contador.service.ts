import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Contador } from './contador.model';

@Injectable({
  providedIn: 'root'
})
export class ContadorService {

  private API_URL = 'http://localhost:3000/contadores'; // URL da API externa

  private contadores: Contador[] = [
    { id: 1, nome: 'Contador 1', email: 'contador1@example.com', crc: '12345', crc_uf: 'SP' },
    { id: 2, nome: 'Contador 2', email: 'contador2@example.com', crc: '54321', crc_uf: 'RJ' }
  ];

  constructor(private http: HttpClient) { }

  getContadores(): Observable<Contador[]> {
    // return this.http.get<Contador[]>(this.API_URL);
    return of(this.contadores);
  }

  getContador(id: number): Observable<Contador> {
    // return this.http.get<Contador>(`${this.API_URL}/${id}`);
    const contador = this.contadores.find(c => c.id === id);
    return of(contador!)
  }

  createContador(contador: Contador): Observable<Contador> {
    // return this.http.post<Contador>(this.API_URL, contador);
    contador.id = this.contadores.length + 1;
    this.contadores.push(contador);
    return of(contador);
  }

  updateContador(contador: Contador): Observable<Contador> {
    // return this.http.put<Contador>(`${this.API_URL}/${contador.id}`, contador);
    const index = this.contadores.findIndex(c => c.id === contador.id);
    this.contadores[index] = contador;
    return of(contador);
  }

  deleteContador(id: number): Observable<any> {
    // return this.http.delete(`${this.API_URL}/${id}`);
    const index = this.contadores.findIndex(c => c.id === id);
    this.contadores.splice(index, 1);
    return of({});
  }
}
