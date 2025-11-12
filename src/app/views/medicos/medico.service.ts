import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medico } from './medico.model';
import { environment } from '../../../environments/environment';
import { Tarifario } from '../tarifarios/tarifario.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  private API_URL = `${environment.apiUrl}/medicos`; // URL da API externa

  constructor(private http: HttpClient) { }

  getMedicos(): Observable<Medico[]> {
    return this.http.get<Medico[]>(this.API_URL);
  }

  getMedico(id: number): Observable<Medico> {
    return this.http.get<Medico>(`${this.API_URL}/${id}`);
  }

  createMedico(medico: Medico): Observable<Medico> {
    return this.http.post<Medico>(this.API_URL, medico);
  }

  updateMedico(medico: Medico): Observable<Medico> {
    return this.http.put<Medico>(`${this.API_URL}/${medico.id}`, medico);
  }

  deleteMedico(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  getTarifariosAtuais(medicoId: number): Observable<Tarifario[]> {
    return this.http.get<Tarifario[]>(`${this.API_URL}/${medicoId}/tarifarios-atuais`);
  }
}
