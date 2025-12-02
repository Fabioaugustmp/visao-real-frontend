import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Financeiro, PageFinanceiro, Pageable } from './financeiro.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceiroService {

  private API_URL = `${environment.apiUrl}/financeiros`;

  constructor(private http: HttpClient) { }

  getFinanceiros(pageable?: Pageable, ticketId?: string): Observable<PageFinanceiro> {
    let params = new HttpParams();

    if (pageable) {
      if (pageable.page !== undefined && pageable.page !== null) {
        params = params.append('page', pageable.page.toString());
      }
      if (pageable.size !== undefined && pageable.size !== null) {
        params = params.append('size', pageable.size.toString());
      }
      if (pageable.sort && pageable.sort.length > 0) {
        pageable.sort.forEach(s => {
          params = params.append('sort', s);
        });
      }
    }

    if (ticketId) {
      params = params.append('ticketId', ticketId);
    }

    return this.http.get<PageFinanceiro>(this.API_URL, { params });
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