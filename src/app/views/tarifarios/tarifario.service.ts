import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tarifario } from './tarifario.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarifarioService {

  private API_URL = `${environment.apiUrl}/tarifarios`;

  constructor(private http: HttpClient) { }

  getTarifarios(): Observable<Tarifario[]> {
    return this.http.get<Tarifario[]>(this.API_URL);
  }

  getTarifario(id: number): Observable<Tarifario> {
    return this.http.get<Tarifario>(`${this.API_URL}/${id}`);
  }

  createTarifario(tarifario: Tarifario): Observable<Tarifario> {
    return this.http.post<Tarifario>(this.API_URL, tarifario);
  }

  updateTarifario(tarifario: Tarifario): Observable<Tarifario> {
    return this.http.put<Tarifario>(`${this.API_URL}/${tarifario.id}`, tarifario);
  }

  deleteTarifario(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
