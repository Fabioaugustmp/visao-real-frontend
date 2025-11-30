import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Faturamento {
  faturamentoMes: number;
  faturamentoSemana: number;
  faturamentoDia: number;
  faturamentoAnual: number;
}

export interface ChartDataset {
  label: string;
  backgroundColor: string | null;
  borderColor: string | null;
  data: number[];
}

export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface DashboardData {
  mainChart: ChartData;
  indicadoresChart: ChartData;
  taxaCartaoChart: ChartData;
}

@Injectable({
  providedIn: 'root'
})
export class RelatoriosDashboardService {

  private apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) { }

  getDashboardData(medicoId?: string): Observable<DashboardData> {
    let params = new HttpParams();
    if (medicoId) {
      params = params.set('medicoId', medicoId);
    }
    return this.http.get<DashboardData>(this.apiUrl, { params });
  }

  // Keep for backward compatibility
  getFaturamento(): Observable<Faturamento> {
    return this.http.get<Faturamento>(`${this.apiUrl}/faturamento`);
  }
}
