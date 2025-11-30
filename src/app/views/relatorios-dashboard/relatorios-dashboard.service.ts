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

  private dashboardApiUrl = `${environment.apiUrl}/dashboard`;
  private faturamentoApiUrl = `${environment.apiUrl}/dashboard/faturamento`;

  constructor(private http: HttpClient) { }

  getDashboardData(medicoId?: number, startDate?: string, finishDate?: string, year?: number): Observable<DashboardData> {
    let params = new HttpParams();
    if (medicoId) {
      params = params.set('medicoId', medicoId.toString());
    }
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (finishDate) {
      params = params.set('finishDate', finishDate);
    }
    if (year) {
      params = params.set('year', year.toString());
    }
    return this.http.get<DashboardData>(this.dashboardApiUrl, { params });
  }

  getFaturamento(medicoId?: number, startDate?: string, finishDate?: string): Observable<Faturamento> {
    let params = new HttpParams();
    if (medicoId) {
      params = params.set('medicoId', medicoId.toString());
    }
    if (startDate) {
      params = params.set('startDate', startDate);
    }
    if (finishDate) {
      params = params.set('finishDate', finishDate);
    }
    return this.http.get<Faturamento>(this.faturamentoApiUrl, { params });
  }
}
