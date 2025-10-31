import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contador } from './contador.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContadorService {

  private API_URL = `${environment.apiUrl}/contadores`; // URL da API externa

  constructor(private http: HttpClient) { }

  getContadores(): Observable<Contador[]> {
    return this.http.get<Contador[]>(this.API_URL);
  }

  getContador(id: number): Observable<Contador> {
    return this.http.get<Contador>(`${this.API_URL}/${id}`);
  }

  createContador(contador: Contador): Observable<Contador> {
    return this.http.post<Contador>(this.API_URL, contador);
  }

  updateContador(contador: Contador): Observable<Contador> {
    return this.http.put<Contador>(`${this.API_URL}/${contador.id}`, contador);
  }

  deleteContador(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
