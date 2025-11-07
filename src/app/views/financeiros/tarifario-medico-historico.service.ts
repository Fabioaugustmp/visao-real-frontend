import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TarifarioMedicoHistorico } from './tarifario-medico-historico.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TarifarioMedicoHistoricoService {

  private API_URL = `${environment.apiUrl}/tarifarios-historico`;

  constructor(private http: HttpClient) { }

  getTarifarios(): Observable<TarifarioMedicoHistorico[]> {
    return this.http.get<TarifarioMedicoHistorico[]>(this.API_URL);
  }
}
