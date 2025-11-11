import { Component } from '@angular/core';
import { ChartjsComponent } from '@coreui/angular-chartjs';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent } from '@coreui/angular';

@Component({
  selector: 'app-relatorios-dashboard-2',
  templateUrl: './relatorios-dashboard-2.component.html',
  styleUrls: ['./relatorios-dashboard-2.component.scss'],
  standalone: true,
  imports: [RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, ChartjsComponent]
})
export class RelatoriosDashboard2Component {

  constructor() { }

}
