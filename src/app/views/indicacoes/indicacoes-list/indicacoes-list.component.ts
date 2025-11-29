import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Indicacao, PageIndicacao, Pageable } from '../indicacao.model';
import { IndicacaoService } from '../indicacao.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, GridModule, TableModule, PaginationModule } from '@coreui/angular';

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
    ButtonModule,
    PaginationModule
  ]
})
export class IndicacoesListComponent implements OnInit {

  indicacoes: Indicacao[] = [];
  currentPage = 0;
  pageSize = 20;
  totalElements = 0;
  totalPages = 0;
  sort: string[] = ['id,asc'];

  constructor(
    private indicacaoService: IndicacaoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadIndicacoes(this.currentPage, this.pageSize);
  }

  loadIndicacoes(page: number, size: number): void {
    const pageable: Pageable = { page, size, sort: this.sort };
    this.indicacaoService.getIndicacoes(pageable).subscribe(
      (response: PageIndicacao) => {
        this.indicacoes = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      },
      error => {
        console.error('Error loading indicacoes', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadIndicacoes(this.currentPage, this.pageSize);
  }

  excluirIndicacao(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta indicação?')) {
      this.indicacaoService.deleteIndicacao(id).subscribe(() => {
        this.loadIndicacoes(this.currentPage, this.pageSize);
      });
    }
  }
}
