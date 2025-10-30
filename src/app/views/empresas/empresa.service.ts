import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Empresa } from './empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private API_URL = 'http://localhost:3000/empresas'; // URL da API externa

  private empresas: Empresa[] = [
    { id: 1, CNPJ: 12345678901234, razao_social: 'Empresa 1', id_contrato_cartao: 1, id_contador: 1 },
    { id: 2, CNPJ: 43210987654321, razao_social: 'Empresa 2', id_contrato_cartao: 2, id_contador: 2 }
  ];

  constructor(private http: HttpClient) { }

  getEmpresas(): Observable<Empresa[]> {
    // return this.http.get<Empresa[]>(this.API_URL);
    return of(this.empresas);
  }

  getEmpresa(id: number): Observable<Empresa> {
    // return this.http.get<Empresa>(`${this.API_URL}/${id}`);
    const empresa = this.empresas.find(e => e.id === id);
    return of(empresa!)
  }

  createEmpresa(empresa: Empresa): Observable<Empresa> {
    // return this.http.post<Empresa>(this.API_URL, empresa);
    empresa.id = this.empresas.length + 1;
    this.empresas.push(empresa);
    return of(empresa);
  }

  updateEmpresa(empresa: Empresa): Observable<Empresa> {
    // return this.http.put<Empresa>(`${this.API_URL}/${empresa.id}`, empresa);
    const index = this.empresas.findIndex(e => e.id === empresa.id);
    this.empresas[index] = empresa;
    return of(empresa);
  }

  deleteEmpresa(id: number): Observable<any> {
    // return this.http.delete(`${this.API_URL}/${id}`);
    const index = this.empresas.findIndex(e => e.id === id);
    this.empresas.splice(index, 1);
    return of({});
  }
}
