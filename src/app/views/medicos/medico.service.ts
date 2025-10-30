import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Medico } from './medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private API_URL = 'http://localhost:3000/medicos'; // URL da API externa

  private medicos: Medico[] = [
    { id: 1, crm: 12345, nome: 'Dr. João da Silva', data_nasc: new Date('1980-01-01'), cpf: 12345678901, taxa_imposto: 10, id_empresa: 1, id_usuario: 1, email: 'joao.silva@example.com' },
    { id: 2, crm: 54321, nome: 'Dra. Maria Souza', data_nasc: new Date('1985-05-10'), cpf: 10987654321, taxa_imposto: 12, id_empresa: 1, id_usuario: 2, email: 'maria.souza@example.com' }
  ];

  constructor(private http: HttpClient) { }

  getMedicos(): Observable<Medico[]> {
    // return this.http.get<Medico[]>(this.API_URL);
    return of(this.medicos);
  }

  getMedico(id: number): Observable<Medico> {
    // return this.http.get<Medico>(`${this.API_URL}/${id}`);
    const medico = this.medicos.find(m => m.id === id);
    return of(medico!)
  }

  createMedico(medico: Medico): Observable<Medico> {
    // return this.http.post<Medico>(this.API_URL, medico);
    medico.id = this.medicos.length + 1;
    this.medicos.push(medico);
    return of(medico);
  }

  updateMedico(medico: Medico): Observable<Medico> {
    // return this.http.put<Medico>(`${this.API_URL}/${medico.id}`, medico);
    const index = this.medicos.findIndex(m => m.id === medico.id);
    this.medicos[index] = medico;
    return of(medico);
  }

  deleteMedico(id: number): Observable<any> {
    // return this.http.delete(`${this.API_URL}/${id}`);
    const index = this.medicos.findIndex(m => m.id === id);
    this.medicos.splice(index, 1);
    return of({});
  }
}
