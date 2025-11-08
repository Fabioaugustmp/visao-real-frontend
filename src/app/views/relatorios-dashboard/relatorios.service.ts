import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RelatorioMedicoDTO } from './relatorios.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelatoriosService {
  private apiUrl = `${environment.apiUrl}/api/relatorios`;

  constructor(private http: HttpClient) { }

  gerarRelatorioMedico(medicoId: number, dataInicio: string, dataFim: string): Observable<RelatorioMedicoDTO> {
    let params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this.http.get<RelatorioMedicoDTO>(`${this.apiUrl}/medico/${medicoId}`, { params });
  }
}
