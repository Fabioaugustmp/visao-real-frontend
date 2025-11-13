import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Financeiro } from './financeiro.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  private API_URL = `${environment.apiUrl}/financeiros`;

  constructor(private http: HttpClient) { }

  getFinanceiros(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}?page=${page}&size=${size}`);
  }

  getFinanceiro(id: number): Observable<Financeiro> {
    return this.http.get<Financeiro>(`${this.API_URL}/${id}`);
  }

  createFinanceiro(financeiro: Financeiro): Observable<Financeiro> {
    return this.http.post<Financeiro>(this.API_URL, financeiro);
  }

  updateFinanceiro(financeiro: Financeiro): Observable<Financeiro> {
    return this.http.put<Financeiro>(`${this.API_URL}/${financeiro.id}`, financeiro);
  }

  deleteFinanceiro(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}