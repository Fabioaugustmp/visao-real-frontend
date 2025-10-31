import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from './empresa.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private API_URL = `${environment.apiUrl}/empresas`; // URL da API externa

  constructor(private http: HttpClient) { }

  getEmpresas(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.API_URL);
  }

  getEmpresa(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.API_URL}/${id}`);
  }

  createEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.API_URL, empresa);
  }

  updateEmpresa(empresa: Empresa): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.API_URL}/${empresa.id}`, empresa);
  }

  deleteEmpresa(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}
