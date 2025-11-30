import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardHeaderComponent,
  ColComponent,
  FormSelectDirective,
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

@Component({
  selector: 'app-relatorios-dashboard',
  templateUrl: './relatorios-dashboard.component.html',
  styleUrls: ['./relatorios-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    WidgetModule,
    CardComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    TextColorDirective,
    CardHeaderComponent,
    ButtonDirective,
    ReactiveFormsModule,
    ChartjsComponent,
    CardFooterComponent,
    ProgressComponent,
    TableDirective,
    IconDirective,
    FormSelectDirective
  ]
})
export class RelatoriosDashboardComponent implements OnInit {

  mainChart: any = {};
  indicadoresChart: any = {};
  taxaCartaoChart: any = {};
  faturamento: Faturamento | undefined;

  constructor(
    private relatoriosDashboardService: RelatoriosDashboardService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.loadDashboardData();
    this.loadFaturamento();
  }

  private loadDashboardData(): void {
    // Check user role and get appropriate data
    const userRoles = this.authService.getUserRoles();

    userRoles.subscribe(roles => {
      let medicoId: string | null = null;

      // If user is MEDICO (and not ADMIN), get their ID
      if (roles.includes('MEDICO') && !roles.includes('ADMIN') && !roles.includes('ADMINISTRADOR')) {
        medicoId = this.authService.getUserId();
      }

      // Fetch dashboard data
      this.relatoriosDashboardService.getDashboardData(medicoId || undefined).subscribe({
        next: (data: DashboardData) => {
          this.initChartsFromAPI(data);
        },
        error: (error) => {
          console.error('Error loading dashboard data:', error);
          // Fallback to default charts if API fails
          this.initDefaultCharts();
        }
      });
    });
  }

  private loadFaturamento(): void {
    this.relatoriosDashboardService.getFaturamento().subscribe({
      next: (data) => {
        this.faturamento = data;
      },
      error: (error) => {
        console.error('Error loading faturamento:', error);
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