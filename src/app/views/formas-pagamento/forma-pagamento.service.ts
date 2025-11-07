import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormaPagamento } from './forma-pagamento.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FormaPagamentoService {

  private API_URL = `${environment.apiUrl}/formas_pagamento`;

  constructor(private http: HttpClient) { }

  getFormasPagamento(): Observable<FormaPagamento[]> {
    return this.http.get<FormaPagamento[]>(this.API_URL);
  }

  getFormaPagamento(id: number): Observable<FormaPagamento> {
    return this.http.get<FormaPagamento>(`${this.API_URL}/${id}`);
  }

  createFormaPagamento(formaPagamento: FormaPagamento): Observable<FormaPagamento> {
    return this.http.post<FormaPagamento>(this.API_URL, formaPagamento);
  }

  updateFormaPagamento(formaPagamento: FormaPagamento): Observable<FormaPagamento> {
    return this.http.put<FormaPagamento>(`${this.API_URL}/${formaPagamento.id}`, formaPagamento);
  }

  deleteFormaPagamento(id: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}