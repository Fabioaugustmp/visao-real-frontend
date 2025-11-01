import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Indicacao } from './indicacao.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndicacaoService {

  private API_URL = `${environment.apiUrl}/indicacoes`;

  constructor(private http: HttpClient) { }

  getIndicacoes(): Observable<Indicacao[]> {
    return this.http.get<Indicacao[]>(this.API_URL);
  }

  getIndicacao(id: number): Observable<Indicacao> {
    return this.http.get<Indicacao>(`${this.API_URL}/${id}`);
  }

  createIndicacao(indicacao: Indicacao): Observable<Indicacao> {
    return this.http.post<Indicacao>(this.API_URL, indicacao);
  }

  updateIndicacao(indicacao: Indicacao): Observable<Indicacao> {
    return this.http.put<Indicacao>(`${this.API_URL}/${indicacao.id}`, indicacao);
  }

  deleteIndicacao(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}