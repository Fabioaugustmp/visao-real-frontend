import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Perfil } from './perfil.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private API_URL = `${environment.apiUrl}/perfis`;

  constructor(private http: HttpClient) { }

  getPerfis(): Observable<Perfil[]> {
    return this.http.get<Perfil[]>(this.API_URL);
  }
}
