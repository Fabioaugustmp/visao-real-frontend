import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Indicado } from './indicado.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndicadoService {

  private API_URL = `${environment.apiUrl}/indicados`;

  constructor(private http: HttpClient) { }

  getIndicados(): Observable<Indicado[]> {
    return this.http.get<Indicado[]>(this.API_URL);
  }

  getIndicado(id: number): Observable<Indicado> {
    return this.http.get<Indicado>(`${this.API_URL}/${id}`);
  }

  createIndicado(indicado: Indicado): Observable<Indicado> {
    return this.http.post<Indicado>(this.API_URL, indicado);
  }

  updateIndicado(indicado: Indicado): Observable<Indicado> {
    return this.http.put<Indicado>(`${this.API_URL}/${indicado.id}`, indicado);
  }

  deleteIndicado(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}