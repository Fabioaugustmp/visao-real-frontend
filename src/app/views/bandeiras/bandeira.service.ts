import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bandeira } from './bandeira.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BandeiraService {

  private API_URL = `${environment.apiUrl}/bandeiras`;

  constructor(private http: HttpClient) { }

  getBandeiras(): Observable<Bandeira[]> {
    return this.http.get<Bandeira[]>(this.API_URL);
  }

  getBandeira(id: number): Observable<Bandeira> {
    return this.http.get<Bandeira>(`${this.API_URL}/${id}`);
  }

  createBandeira(bandeira: Bandeira): Observable<Bandeira> {
    return this.http.post<Bandeira>(this.API_URL, bandeira);
  }

  updateBandeira(bandeira: Bandeira): Observable<Bandeira> {
    return this.http.put<Bandeira>(`${this.API_URL}/${bandeira.id}`, bandeira);
  }

  deleteBandeira(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}