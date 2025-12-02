import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Indicacao, PageIndicacao, Pageable } from '../indicacao.model';
import { IndicacaoService } from '../indicacao.service';
import { ButtonModule, CardModule, GridModule, TableModule, PaginationModule, FormModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';

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
    PaginationModule,
    FormModule,
    FormsModule
  ]
})
export class IndicacoesListComponent implements OnInit {

  indicacoes: Indicacao[] = [];
  isLoading = false;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  sort: string[] = ['id,asc'];
  currentSortField = 'id';
  isSortAsc = true;

  searchStatus: string | null = null;

  constructor(private indicacaoService: IndicacaoService) { }

  ngOnInit(): void {
    this.loadIndicacoes(this.currentPage, this.pageSize);
  }

  loadIndicacoes(page: number, size: number): void {
    this.isLoading = true;
    const pageable: Pageable = { page, size, sort: this.sort };
    this.indicacaoService.getIndicacoes(pageable, this.searchStatus ? this.searchStatus : undefined).subscribe(
      (response: PageIndicacao) => {
        this.indicacoes = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading indicacoes', error);
        this.isLoading = false;
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadIndicacoes(this.currentPage, this.pageSize);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadIndicacoes(this.currentPage, this.pageSize);
  }

  searchIndicacoes(): void {
    this.currentPage = 0;
    this.loadIndicacoes(this.currentPage, this.pageSize);
  }

  clearSearch(): void {
    this.searchStatus = null;
    this.currentPage = 0;
    this.loadIndicacoes(this.currentPage, this.pageSize);
  }

  toggleSort(field: string): void {
    if (this.currentSortField === field) {
      this.isSortAsc = !this.isSortAsc;
    } else {
      this.currentSortField = field;
      this.isSortAsc = true;
    }

    const direction = this.isSortAsc ? 'asc' : 'desc';
    this.sort = [`${this.currentSortField},${direction}`];
    this.loadIndicacoes(this.currentPage, this.pageSize);
  }

  deleteIndicacao(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta indicação?')) {
      this.indicacaoService.deleteIndicacao(id).subscribe(() => {
        this.loadIndicacoes(this.currentPage, this.pageSize);
      });
    }
  }
}