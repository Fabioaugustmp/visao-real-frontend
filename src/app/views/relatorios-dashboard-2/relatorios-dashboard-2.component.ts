import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  RowComponent,
  ColComponent,
  TextColorDirective,
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  CardFooterComponent,
  WidgetModule,
  FormDirective,
  FormLabelDirective,
  FormControlDirective,
  ButtonDirective,
  FormSelectDirective
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { getStyle } from '@coreui/utils';
import { BillingDashboardService, BillingByProcedureDTO, ChartDataDTO } from './billing-dashboard.service';
import { MedicoService } from '../medicos/medico.service';
import { Medico } from '../medicos/medico.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-relatorios-dashboard-2',
  templateUrl: './relatorios-dashboard-2.component.html',
  styleUrls: ['./relatorios-dashboard-2.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    CardFooterComponent,
    ChartjsComponent,
    WidgetModule,
    FormDirective,
    FormLabelDirective,
    FormControlDirective,
    ButtonDirective,
    FormSelectDirective
  ]
})
export class RelatoriosDashboard2Component implements OnInit {

  // Filter form
  filterForm!: FormGroup;

  // User role info
  isAdmin = false;
  isMedico = false;
  currentMedicoId: number | null = null;

  // Medicos list for admin dropdown
  medicos: Medico[] = [];

  // Loading states
  loadingProcedure = false;
  loadingPaymentMethod = false;
  loadingPaymentCondition = false;
  loadingAnnual = false;

  // Filter collapse state
  isFilterCollapsed = true;

  // Chart data
  procedureData: BillingByProcedureDTO[] = [];
  paymentMethodChart: any = {};
  paymentConditionChart: any = {};
  annualBillingChart: any = {};

  // Years for dropdown
  years: number[] = [];

  constructor(
    private fb: FormBuilder,
    private billingService: BillingDashboardService,
    private medicoService: MedicoService,
    private authService: AuthService
  ) {
    // Generate years (current year and 5 years back)
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 6; i++) {
      this.years.push(currentYear - i);
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    this.detectUserRole();
  }

  private initializeForm(): void {
    this.filterForm = this.fb.group({
      startDate: [''],
      finishDate: [''],
      medicoId: [null],
      year: [new Date().getFullYear()]
    });
  }

  private detectUserRole(): void {
    this.authService.getUserRoles().subscribe(roles => {
      this.isMedico = roles.includes('MEDICO') || roles.includes('ROLE_MEDICO');
      this.isAdmin = roles.includes('ADMIN') || roles.includes('ADMINISTRADOR') || roles.includes('ROLE_ADMINISTRADOR');

      if (this.isMedico && !this.isAdmin) {
        // MEDICO user - get their ID
        const userId = this.authService.getUserId();
        this.currentMedicoId = userId ? parseInt(userId) : null;
      } else if (this.isAdmin) {
        // ADMIN user - load medicos list
        this.loadMedicos();
      }

      // Load initial data
      this.loadAllData();
    });
  }

  private loadMedicos(): void {
    this.medicoService.getMedicos().subscribe({
      next: (medicos) => {
        this.medicos = medicos;
      },
      error: (error) => {
        console.error('Error loading medicos:', error);
      }
    });
  }

  toggleFilter(): void {
    this.isFilterCollapsed = !this.isFilterCollapsed;
  }

  onApplyFilters(): void {
    this.loadAllData();
  }

  onClearFilters(): void {
    this.filterForm.patchValue({
      startDate: '',
      finishDate: '',
      medicoId: null,
      year: new Date().getFullYear()
    });
    this.loadAllData();
    this.isFilterCollapsed = true; // Collapse after clearing
  }

  private loadAllData(): void {
    const filters = this.getFilters();
    this.checkFilterState();

    this.loadBillingByProcedure(filters.medicoId, filters.startDate, filters.finishDate);
    this.loadBillingByPaymentMethod(filters.medicoId, filters.startDate, filters.finishDate);
    this.loadBillingByPaymentCondition(filters.medicoId, filters.startDate, filters.finishDate);
    this.loadAnnualBilling(filters.year, filters.medicoId);
  }

  private checkFilterState(): void {
    const formValue = this.filterForm.value;
    // Keep filter expanded if user has entered any data
    const hasFilterData = formValue.startDate || formValue.finishDate ||
      (this.isAdmin && formValue.medicoId) ||
      formValue.year !== new Date().getFullYear();

    if (hasFilterData && this.isFilterCollapsed) {
      this.isFilterCollapsed = false;
    }
  }

  private getFilters() {
    const formValue = this.filterForm.value;

    // Determine medicoId based on role
    let medicoId: number | undefined;
    if (this.isMedico && !this.isAdmin) {
      // MEDICO user - always use their own ID
      medicoId = this.currentMedicoId || undefined;
    } else if (this.isAdmin) {
      // ADMIN user - use selected medico or undefined for all
      medicoId = formValue.medicoId || undefined;
    }

    return {
      medicoId,
      startDate: formValue.startDate || undefined,
      finishDate: formValue.finishDate || undefined,
      year: formValue.year || undefined
    };
  }

  private loadBillingByProcedure(medicoId?: number, startDate?: string, finishDate?: string): void {
    this.loadingProcedure = true;
    this.billingService.getBillingByProcedure(medicoId, startDate, finishDate).subscribe({
      next: (data) => {
        this.procedureData = data;
        this.loadingProcedure = false;
      },
      error: (error) => {
        console.error('Error loading billing by procedure:', error);
        this.procedureData = [];
        this.loadingProcedure = false;
      }
    });
  }

  private loadBillingByPaymentMethod(medicoId?: number, startDate?: string, finishDate?: string): void {
    this.loadingPaymentMethod = true;
    this.billingService.getBillingByPaymentMethod(medicoId, startDate, finishDate).subscribe({
      next: (data) => {
        this.paymentMethodChart = this.transformToChart(data, 'doughnut');
        this.loadingPaymentMethod = false;
      },
      error: (error) => {
        console.error('Error loading billing by payment method:', error);
        this.paymentMethodChart = this.getEmptyChart();
        this.loadingPaymentMethod = false;
      }
    });
  }

  private loadBillingByPaymentCondition(medicoId?: number, startDate?: string, finishDate?: string): void {
    this.loadingPaymentCondition = true;
    this.billingService.getBillingByPaymentCondition(medicoId, startDate, finishDate).subscribe({
      next: (data) => {
        this.paymentConditionChart = this.transformToChart(data, 'pie');
        this.loadingPaymentCondition = false;
      },
      error: (error) => {
        console.error('Error loading billing by payment condition:', error);
        this.paymentConditionChart = this.getEmptyChart();
        this.loadingPaymentCondition = false;
      }
    });
  }

  private loadAnnualBilling(year?: number, medicoId?: number): void {
    this.loadingAnnual = true;
    this.billingService.getAnnualBilling(year, medicoId).subscribe({
      next: (data) => {
        this.annualBillingChart = this.transformToChart(data, 'bar');
        this.loadingAnnual = false;
      },
      error: (error) => {
        console.error('Error loading annual billing:', error);
        this.annualBillingChart = this.getEmptyChart();
        this.loadingAnnual = false;
      }
    });
  }

  private transformToChart(data: ChartDataDTO, type: string): any {
    const brandColors = this.getBrandColors();

    return {
      type,
      data: {
        labels: data.labels,
        datasets: data.datasets.map((dataset, index) => ({
          label: dataset.label,
          backgroundColor: dataset.backgroundColor || this.getColorArray(data.labels.length, brandColors),
          borderColor: dataset.borderColor || brandColors[index % brandColors.length],
          data: dataset.data
        }))
      },
      options: this.getChartOptions(type)
    };
  }

  private getBrandColors(): string[] {
    return [
      getStyle('--cui-primary') || '#321fdb',
      getStyle('--cui-success') || '#2eb85c',
      getStyle('--cui-info') || '#39f',
      getStyle('--cui-warning') || '#f9b115',
      getStyle('--cui-danger') || '#e55353',
      getStyle('--cui-secondary') || '#9da5b1'
    ];
  }

  private getColorArray(length: number, colors: string[]): string[] {
    const result: string[] = [];
    for (let i = 0; i < length; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  }

  private getChartOptions(type: string): any {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom' as const
        }
      }
    };

    if (type === 'bar') {
      return {
        ...baseOptions,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value: any) {
                return 'R$ ' + value.toLocaleString('pt-BR');
              }
            }
          }
        }
      };
    }

    return baseOptions;
  }

  private getEmptyChart(): any {
    return {
      type: 'bar',
      data: {
        labels: [],
        datasets: []
      },
      options: this.getChartOptions('bar')
    };
  }

  getTotalProcedure(): number {
    return this.procedureData.reduce((sum, item) => sum + item.total, 0);
  }
}
