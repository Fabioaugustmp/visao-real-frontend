import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Indicado, PageIndicado, Pageable } from './indicado.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IndicadoService {

  private API_URL = `${environment.apiUrl}/indicados`;

  constructor(private http: HttpClient) { }

  getIndicados(pageable?: Pageable): Observable<PageIndicado> {
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

    return this.http.get<PageIndicado>(this.API_URL, { params });
  }

  // Get all indicados without pagination (for use in forms/dropdowns)
  getAllIndicados(): Observable<Indicado[]> {
    return this.http.get<PageIndicado>(this.API_URL, {
      params: new HttpParams().set('size', '1000') // Get a large page
    }).pipe(
      map(response => response.content)
    );
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