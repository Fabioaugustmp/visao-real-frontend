import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Parcelamento } from './parcelamento.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParcelamentoService {

  private API_URL = `${environment.apiUrl}/parcelamentos`;

  constructor(private http: HttpClient) { }

  getParcelamentos(): Observable<Parcelamento[]> {
    return this.http.get<Parcelamento[]>(this.API_URL);
  }

  getParcelamento(id: number): Observable<Parcelamento> {
    return this.http.get<Parcelamento>(`${this.API_URL}/${id}`);
  }

  createParcelamento(parcelamento: Parcelamento): Observable<Parcelamento> {
    return this.http.post<Parcelamento>(this.API_URL, parcelamento);
  }

  updateParcelamento(parcelamento: Parcelamento): Observable<Parcelamento> {
    return this.http.put<Parcelamento>(`${this.API_URL}/${parcelamento.id}`, parcelamento);
  }

  deleteParcelamento(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}