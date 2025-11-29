import { Component, OnInit } from '@angular/core';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, CardFooterComponent, WidgetModule } from '@coreui/angular';
import { Faturamento, RelatoriosDashboard2Service } from './relatorios-dashboard-2.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relatorios-dashboard-2',
  templateUrl: './relatorios-dashboard-2.component.html',
  styleUrls: ['./relatorios-dashboard-2.component.scss'],
  standalone: true,
  imports: [RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, CardFooterComponent, ChartjsComponent, WidgetModule, CommonModule]
})
export class RelatoriosDashboard2Component implements OnInit {

  faturamento: Faturamento | undefined;

  constructor(private relatoriosDashboard2Service: RelatoriosDashboard2Service) { }

  ngOnInit(): void {
    this.relatoriosDashboard2Service.getFaturamento().subscribe({
      next: (data: Faturamento) => {
        console.log('Component received:', data);
        this.faturamento = data;
      },
      error: (err: any) => {
        console.error('Component error:', err);
      }
    });
  }
}
