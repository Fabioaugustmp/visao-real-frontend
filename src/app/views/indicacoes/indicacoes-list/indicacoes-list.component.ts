import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Indicacao } from '../indicacao.model';
import { IndicacaoService } from '../indicacao.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-indicacoes-list',
  templateUrl: './indicacoes-list.component.html',
  styleUrls: ['./indicacoes-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    TableModule,
    ButtonModule
  ]
})
export class IndicacoesListComponent implements OnInit {

  indicacoes: Indicacao[] = [];

  constructor(
    private indicacaoService: IndicacaoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadIndicacoes();
  }

  loadIndicacoes(): void {
    this.indicacaoService.getIndicacoes().subscribe(data => {
      this.indicacoes = data;
    });
  }

  excluirIndicacao(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta indicação?')) {
      this.indicacaoService.deleteIndicacao(id).subscribe(() => {
        this.loadIndicacoes();
      });
    }
  }
}
