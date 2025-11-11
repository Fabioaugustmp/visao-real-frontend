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

  ngOnInit(): void {
    this.initCharts();
  }

  initCharts(): void {
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