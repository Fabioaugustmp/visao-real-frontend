import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Indicado } from '../indicado.model';
import { IndicadoService } from '../indicado.service';
import { CommonModule } from '@angular/common';
import { BadgeModule, ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-indicados-list',
  templateUrl: './indicados-list.component.html',
  styleUrls: ['./indicados-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    TableModule,
    ButtonModule,
    BadgeModule
  ]
})
export class IndicadosListComponent implements OnInit {

  indicados: Indicado[] = [];

  constructor(
    private indicadoService: IndicadoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadIndicados();
  }

  loadIndicados(): void {
    this.indicadoService.getIndicados().subscribe(data => {
      this.indicados = data;
    });
  }

  excluirIndicado(id: number): void {
    if (confirm('Tem certeza que deseja excluir este indicado?')) {
      this.indicadoService.deleteIndicado(id).subscribe(() => {
        this.loadIndicados();
      });
    }
  }
}
