import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Indicacao, PageIndicacao, Pageable } from './indicacao.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndicacaoService {

  private API_URL = `${environment.apiUrl}/indicacoes`;

  constructor(private http: HttpClient) { }

  getIndicacoes(pageable?: Pageable, status?: string): Observable<PageIndicacao> {
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

    if (status) {
      params = params.append('tipo', status);
    }

    return this.http.get<PageIndicacao>(this.API_URL, { params });
  }

  // Get all indicacoes without pagination (for use in forms/dropdowns)
  getAllIndicacoes(): Observable<Indicacao[]> {
    return this.http.get<PageIndicacao>(this.API_URL, {
      params: new HttpParams().set('size', '1000') // Get a large page
    }).pipe(
      map(response => response.content)
    );
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