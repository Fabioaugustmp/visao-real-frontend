import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RelatorioMedicoDTO } from '../relatorios-dashboard/relatorios.model';

export interface Faturamento {
  faturamentoMes: number;
  faturamentoSemana: number;
  faturamentoDia: number;
  faturamentoAnual: number;
}

@Injectable({
  providedIn: 'root'
})
export class RelatoriosDashboard2Service {

  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getFaturamento(): Observable<Faturamento> {
    return this.http.get<Faturamento>(`${this.apiUrl}/faturamento`);
  }

  gerarRelatorioMedico(medicoId: number, dataInicio: string, dataFim: string): Observable<RelatorioMedicoDTO> {
    const relatoriosUrl = `${environment.apiUrl}/api/relatorios`;
    let params = new HttpParams()
      .set('dataInicio', dataInicio)
      .set('dataFim', dataFim);

    return this.http.get<RelatorioMedicoDTO>(`${relatoriosUrl}/medico/${medicoId}`, { params });
  }
}
