import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Grupo } from './grupo.model';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private API_URL = 'http://localhost:3000/grupos'; // URL da API externa

  private grupos: Grupo[] = [
    { id: 1, nome_grupo: 'Grupo 1' },
    { id: 2, nome_grupo: 'Grupo 2' }
  ];

  constructor(private http: HttpClient) { }

  getGrupos(): Observable<Grupo[]> {
    // return this.http.get<Grupo[]>(this.API_URL);
    return of(this.grupos);
  }

  getGrupo(id: number): Observable<Grupo> {
    // return this.http.get<Grupo>(`${this.API_URL}/${id}`);
    const grupo = this.grupos.find(g => g.id === id);
    return of(grupo!)
  }

  createGrupo(grupo: Grupo): Observable<Grupo> {
    // return this.http.post<Grupo>(this.API_URL, grupo);
    grupo.id = this.grupos.length + 1;
    this.grupos.push(grupo);
    return of(grupo);
  }

  updateGrupo(grupo: Grupo): Observable<Grupo> {
    // return this.http.put<Grupo>(`${this.API_URL}/${grupo.id}`, grupo);
    const index = this.grupos.findIndex(g => g.id === grupo.id);
    this.grupos[index] = grupo;
    return of(grupo);
  }

  deleteGrupo(id: number): Observable<any> {
    // return this.http.delete(`${this.API_URL}/${id}`);
    const index = this.grupos.findIndex(g => g.id === id);
    this.grupos.splice(index, 1);
    return of({});
  }
}
