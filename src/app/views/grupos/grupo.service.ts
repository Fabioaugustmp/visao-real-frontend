import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Grupo } from './grupo.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private API_URL = `${environment.apiUrl}/grupos`; // URL da API externa

  constructor(private http: HttpClient) { }

  getGrupos(): Observable<Grupo[]> {
    return this.http.get<Grupo[]>(this.API_URL);
  }

  getGrupo(id: number): Observable<Grupo> {
    return this.http.get<Grupo>(`${this.API_URL}/${id}`);
  }

  createGrupo(grupo: Grupo): Observable<Grupo> {
    return this.http.post<Grupo>(this.API_URL, grupo);
  }

  updateGrupo(grupo: Grupo): Observable<Grupo> {
    return this.http.put<Grupo>(`${this.API_URL}/${grupo.id}`, grupo);
  }

  deleteGrupo(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
