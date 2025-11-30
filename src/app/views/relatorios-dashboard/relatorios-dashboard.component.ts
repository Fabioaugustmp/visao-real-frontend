import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormSelectDirective,
  FormDirective,
  FormLabelDirective,
  FormControlDirective,
  ProgressComponent,
  RowComponent,
  TableDirective,
  TextColorDirective,
  WidgetModule
} from '@coreui/angular';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { IconDirective } from '@coreui/icons-angular';
import { getStyle } from '@coreui/utils';
import { Faturamento, RelatoriosDashboardService, DashboardData } from './relatorios-dashboard.service';
import { AuthService } from '../../services/auth.service';
import { MedicoService } from '../medicos/medico.service';
import { Medico } from '../medicos/medico.model';

@Component({
  selector: 'app-relatorios-dashboard',
  templateUrl: './relatorios-dashboard.component.html',
  styleUrls: ['./relatorios-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    WidgetModule,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardHeaderComponent,
    ButtonDirective,
    ChartjsComponent,
    CardFooterComponent,
    ProgressComponent,
    TableDirective,
    IconDirective,
    FormSelectDirective,
    FormDirective,
    FormLabelDirective,
    FormControlDirective
  ]
})
export class RelatoriosDashboardComponent implements OnInit {

  // Filter form
  filterForm!: FormGroup;

  // User role info
  isAdmin = false;
  isMedico = false;
  currentMedicoId: number | null = null;

  // Medicos list for admin dropdown
  medicos: Medico[] = [];

  // Loading states
  loadingDashboard = false;
  loadingFaturamento = false;

  // Filter collapse state
  isFilterCollapsed = true;

  // Chart data
  mainChart: any = {};
  indicadoresChart: any = {};
  taxaCartaoChart: any = {};
  faturamento: Faturamento | undefined;

  // Years for dropdown
  years: number[] = [];

  constructor(
    private fb: FormBuilder,
    private relatoriosDashboardService: RelatoriosDashboardService,
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
    this.loadDashboardData(filters.medicoId, filters.startDate, filters.finishDate, filters.year);
    this.loadFaturamento(filters.medicoId, filters.startDate, filters.finishDate);
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

  private loadDashboardData(medicoId?: number, startDate?: string, finishDate?: string, year?: number): void {
    this.loadingDashboard = true;
    this.relatoriosDashboardService.getDashboardData(medicoId, startDate, finishDate, year).subscribe({
      next: (data: DashboardData) => {
        this.initChartsFromAPI(data);
        this.loadingDashboard = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        // Fallback to default charts if API fails
        this.initDefaultCharts();
        this.loadingDashboard = false;
      }
    });
  }

  private loadFaturamento(medicoId?: number, startDate?: string, finishDate?: string): void {
    this.loadingFaturamento = true;
    this.relatoriosDashboardService.getFaturamento(medicoId, startDate, finishDate).subscribe({
      next: (data) => {
        this.faturamento = data;
        this.loadingFaturamento = false;
      },
      error: (error) => {
        console.error('Error loading faturamento:', error);
        this.loadingFaturamento = false;
      }
    });
  }

  private initChartsFromAPI(data: DashboardData): void {
    const brandSuccess = getStyle('--cui-success') || '#4dbd74';
    const brandInfo = getStyle('--cui-info') || '#20a8d8';
    const brandDanger = getStyle('--cui-danger') || '#f86c6b';
    const brandWarning = getStyle('--cui-warning') || '#f8cb00';

    // Main Chart
    this.mainChart = {
      data: {
        labels: data.mainChart.labels,
        datasets: data.mainChart.datasets.map((dataset, index) => ({
          label: dataset.label,
          backgroundColor: dataset.backgroundColor || this.getDefaultColor(index, brandInfo, brandSuccess, brandDanger),
          borderColor: dataset.borderColor || this.getDefaultColor(index, brandInfo, brandSuccess, brandDanger),
          data: dataset.data
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };

    // Indicadores Chart
    this.indicadoresChart = {
      data: {
        labels: data.indicadoresChart.labels,
        datasets: data.indicadoresChart.datasets.map((dataset, index) => ({
          label: dataset.label,
          backgroundColor: dataset.backgroundColor || (index === 0 ? brandDanger : brandSuccess),
          borderColor: dataset.borderColor || (index === 0 ? brandDanger : brandSuccess),
          data: dataset.data
        }))
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    // Taxa Cartão Chart
    this.taxaCartaoChart = {
      data: {
        labels: data.taxaCartaoChart.labels,
        datasets: data.taxaCartaoChart.datasets.map(dataset => ({
          label: dataset.label,
          backgroundColor: dataset.backgroundColor || brandWarning,
          borderColor: dataset.borderColor || brandWarning,
          data: dataset.data
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };
  }

  private getDefaultColor(index: number, color1: string, color2: string, color3: string): string {
    const colors = [color1, color2, color3];
    return colors[index % colors.length];
  }

  private initDefaultCharts(): void {
    const brandSuccess = getStyle('--cui-success') || '#4dbd74';
    const brandInfo = getStyle('--cui-info') || '#20a8d8';
    const brandDanger = getStyle('--cui-danger') || '#f86c6b';
    const brandWarning = getStyle('--cui-warning') || '#f8cb00';

    this.mainChart = {
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
        datasets: [
          {
            label: 'Faturamento',
            backgroundColor: brandInfo,
            borderColor: brandInfo,
            data: [50, 20, 80, 40, 60, 30, 70, 55, 90, 65, 75, 45]
          },
          {
            label: 'À Receber',
            backgroundColor: brandSuccess,
            borderColor: brandSuccess,
            data: [40, 15, 70, 30, 50, 25, 60, 45, 80, 55, 65, 35]
          },
          {
            label: 'Indicantes',
            backgroundColor: brandDanger,
            borderColor: brandDanger,
            data: [10, 5, 10, 10, 10, 5, 10, 10, 10, 10, 10, 10]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };

    this.indicadoresChart = {
      data: {
        labels: ['Indicadores'],
        datasets: [
          {
            label: 'A Pagar',
            backgroundColor: brandDanger,
            borderColor: brandDanger,
            data: [40]
          },
          {
            label: 'A Receber',
            backgroundColor: brandSuccess,
            borderColor: brandSuccess,
            data: [60]
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            grid: {
              display: false
            }
          }
        }
      }
    };

    this.taxaCartaoChart = {
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
        datasets: [
          {
            label: 'Taxa de Cartão',
            backgroundColor: brandWarning,
            borderColor: brandWarning,
            data: [5, 6, 4, 7, 5, 8]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    };
  }
}