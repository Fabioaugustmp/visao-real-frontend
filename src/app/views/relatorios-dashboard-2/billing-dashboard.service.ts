import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// API Response Interfaces
export interface BillingByProcedureDTO {
    descricao: string;
    total: number;
}

export interface DatasetDTO {
    label: string;
    backgroundColor: string | null;
    borderColor: string | null;
    data: number[];
}

export interface ChartDataDTO {
    labels: string[];
    datasets: DatasetDTO[];
}

export interface MedicoDTO {
    id: number;
    nome: string;
    crm: string;
}

@Injectable({
    providedIn: 'root'
})
export class BillingDashboardService {

    private apiUrl = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient) { }

    /**
     * Get billing data grouped by medical procedures
     * @param medicoId Optional medico ID for filtering
     * @param startDate Optional start date (format: YYYY-MM-DD)
     * @param finishDate Optional finish date (format: YYYY-MM-DD)
     */
    getBillingByProcedure(medicoId?: number, startDate?: string, finishDate?: string): Observable<BillingByProcedureDTO[]> {
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
        return this.http.get<BillingByProcedureDTO[]>(`${this.apiUrl}/billing-by-procedure`, { params });
    }

    /**
     * Get billing data grouped by payment method
     * @param medicoId Optional medico ID for filtering
     * @param startDate Optional start date (format: YYYY-MM-DD)
     * @param finishDate Optional finish date (format: YYYY-MM-DD)
     */
    getBillingByPaymentMethod(medicoId?: number, startDate?: string, finishDate?: string): Observable<ChartDataDTO> {
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
        return this.http.get<ChartDataDTO>(`${this.apiUrl}/billing-by-payment-method`, { params });
    }

    /**
     * Get billing data grouped by payment condition
     * @param medicoId Optional medico ID for filtering
     * @param startDate Optional start date (format: YYYY-MM-DD)
     * @param finishDate Optional finish date (format: YYYY-MM-DD)
     */
    getBillingByPaymentCondition(medicoId?: number, startDate?: string, finishDate?: string): Observable<ChartDataDTO> {
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
        return this.http.get<ChartDataDTO>(`${this.apiUrl}/billing-by-payment-condition`, { params });
    }

    /**
     * Get annual billing data
     * @param year Optional year for filtering
     * @param medicoId Optional medico ID for filtering
     */
    getAnnualBilling(year?: number, medicoId?: number): Observable<ChartDataDTO> {
        let params = new HttpParams();
        if (year) {
            params = params.set('year', year.toString());
        }
        if (medicoId) {
            params = params.set('medicoId', medicoId.toString());
        }
        return this.http.get<ChartDataDTO>(`${this.apiUrl}/annual-billing`, { params });
    }
}
