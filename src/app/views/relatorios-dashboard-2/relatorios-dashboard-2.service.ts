import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  private apiUrl = 'http://localhost:8080/dashboard/faturamento-2';

  constructor(private http: HttpClient) { }

  getFaturamento(): Observable<Faturamento> {
    return this.http.get<Faturamento>(this.apiUrl);
  }
}
