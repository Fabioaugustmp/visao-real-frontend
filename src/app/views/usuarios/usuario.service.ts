import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Usuario } from './usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private API_URL = 'http://localhost:3000/usuarios'; // URL da API externa

  private usuarios: Usuario[] = [
    { id: 1, nome: 'Fábio', login: 'fabio', id_grupo: 1, data_criacao: new Date(), status: true, email: 'fabio@example.com', crm: 12345, data_nasc: new Date('1990-01-01'), cpf: 12345678901 },
    { id: 2, nome: 'Admin', login: 'admin', id_grupo: 2, data_criacao: new Date(), status: true, email: 'admin@example.com', crm: 54321, data_nasc: new Date('1985-05-10'), cpf: 10987654321 }
  ];

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    // return this.http.get<Usuario[]>(this.API_URL);
    return of(this.usuarios);
  }

  getUsuario(id: number): Observable<Usuario> {
    // return this.http.get<Usuario>(`${this.API_URL}/${id}`);
    const usuario = this.usuarios.find(u => u.id === id);
    return of(usuario!)
  }

  createUsuario(usuario: Usuario): Observable<Usuario> {
    // return this.http.post<Usuario>(this.API_URL, usuario);
    usuario.id = this.usuarios.length + 1;
    this.usuarios.push(usuario);
    return of(usuario);
  }

  updateUsuario(usuario: Usuario): Observable<Usuario> {
    // return this.http.put<Usuario>(`${this.API_URL}/${usuario.id}`, usuario);
    const index = this.usuarios.findIndex(u => u.id === usuario.id);
    this.usuarios[index] = usuario;
    return of(usuario);
  }

  deleteUsuario(id: number): Observable<any> {
    // return this.http.delete(`${this.API_URL}/${id}`);
    const index = this.usuarios.findIndex(u => u.id === id);
    this.usuarios.splice(index, 1);
    return of({});
  }
}
