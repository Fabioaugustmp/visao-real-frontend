import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RelatoriosService } from './relatorios.service';
import { RelatorioMedicoDTO, DetalheAtendimentoDTO } from './relatorios.model';
import { Medico } from '../medicos/medico.model';
import { MedicoService } from '../medicos/medico.service';
import {
  ButtonModule,
  CardModule,
  GridModule,
  FormModule,
  SpinnerModule
} from '@coreui/angular';
import { ChartjsModule } from '@coreui/angular-chartjs';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-relatorios-dashboard',
  templateUrl: './relatorios-dashboard.component.html',
  styleUrls: ['./relatorios-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    GridModule,
    FormModule,
    ChartjsModule,
    SpinnerModule
  ]
})
export class RelatoriosDashboardComponent implements OnInit {
  reportForm: FormGroup;
  medicos: Medico[] = [];
  relatorio: RelatorioMedicoDTO | null = null;
  loading = false;
  error: string | null = null;

  // Chart configurations
  public totalBilledChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Valor Faturado',
        backgroundColor: '#42A5F5',
        borderColor: '#1E88E5',
        borderWidth: 1
      }
    ]
  };
  public totalBilledChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Valor Faturado por Atendimento'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Data do Atendimento'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Valor (R$)'
        }
      }
    }
  };
  public totalBilledChartType: ChartType = 'bar';

  public appointmentCountChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Número de Atendimentos',
        fill: true,
        tension: 0.4,
        borderColor: '#66BB6A',
        backgroundColor: 'rgba(102, 187, 106, 0.2)'
      }
    ]
  };
  public appointmentCountChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Número de Atendimentos por Dia'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Data'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Contagem'
        },
        beginAtZero: true
      }
    }
  };
  public appointmentCountChartType: ChartType = 'line';


  constructor(
    private fb: FormBuilder,
    private relatoriosService: RelatoriosService,
    private medicoService: MedicoService
  ) {
    this.reportForm = this.fb.group({
      medicoId: [null, Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMedicos();
  }

  loadMedicos(): void {
    this.medicoService.getMedicos().subscribe(
      (data) => {
        this.medicos = data;
      },
      (error) => {
        console.error('Error loading medicos', error);
        this.error = 'Erro ao carregar a lista de médicos.';
      }
    );
  }

  generateReport(): void {
    if (this.reportForm.valid) {
      this.loading = true;
      this.error = null;
      const { medicoId, dataInicio, dataFim } = this.reportForm.value;

      this.relatoriosService.gerarRelatorioMedico(medicoId, dataInicio, dataFim).subscribe(
        (data) => {
          this.relatorio = data;
          this.processChartData(data.detalhes);
          this.loading = false;
        },
        (error) => {
          console.error('Error generating report', error);
          this.error = 'Erro ao gerar o relatório. Verifique os parâmetros e tente novamente.';
          this.loading = false;
          this.relatorio = null; // Clear previous report data
        }
      );
    } else {
      this.error = 'Por favor, preencha todos os campos obrigatórios.';
    }
  }

  processChartData(detalhes: DetalheAtendimentoDTO[]): void {
    // Sort details by date for chronological charts
    detalhes.sort((a, b) => new Date(a.dataAtendimento).getTime() - new Date(b.dataAtendimento).getTime());

    // Total Billed Value Chart
    const billedValueLabels: string[] = [];
    const billedValueData: number[] = [];

    detalhes.forEach(detail => {
      billedValueLabels.push(new Date(detail.dataAtendimento).toLocaleDateString());
      billedValueData.push(detail.valorAtendimento);
    });

    this.totalBilledChartData = {
      labels: billedValueLabels,
      datasets: [
        {
          data: billedValueData,
          label: 'Valor Faturado',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          borderWidth: 1
        }
      ]
    };

    // Appointment Count Chart
    const appointmentCounts: { [key: string]: number } = {};
    detalhes.forEach(detail => {
      const date = new Date(detail.dataAtendimento).toLocaleDateString();
      appointmentCounts[date] = (appointmentCounts[date] || 0) + 1;
    });

    const appointmentCountLabels = Object.keys(appointmentCounts).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
    const appointmentCountData = appointmentCountLabels.map(label => appointmentCounts[label]);

    this.appointmentCountChartData = {
      labels: appointmentCountLabels,
      datasets: [
        {
          data: appointmentCountData,
          label: 'Número de Atendimentos',
          fill: true,
          tension: 0.4,
          borderColor: '#66BB6A',
          backgroundColor: 'rgba(102, 187, 106, 0.2)'
        }
      ]
    };
  }
}
