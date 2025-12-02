import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Indicado, PageIndicado, Pageable } from '../indicado.model';
import { IndicadoService } from '../indicado.service';
import { ButtonModule, CardModule, GridModule, TableModule, PaginationModule, FormModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';

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
    PaginationModule,
    FormModule,
    FormsModule
  ]
})
export class IndicadosListComponent implements OnInit {

  indicados: Indicado[] = [];
  isLoading = false;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  sort: string[] = ['id,asc'];
  currentSortField = 'id';
  isSortAsc = true;

  searchPago: boolean | null = null;
  searchRecebido: boolean | null = null;
  searchDataInicio: string | null = null;
  searchDataFim: string | null = null;

  constructor(private indicadoService: IndicadoService) { }

  ngOnInit(): void {
    this.loadIndicados(this.currentPage, this.pageSize);
  }

  loadIndicados(page: number, size: number): void {
    this.isLoading = true;
    const pageable: Pageable = { page, size, sort: this.sort };
    this.indicadoService.getIndicados(
      pageable,
      this.searchPago === null ? undefined : this.searchPago,
      this.searchRecebido === null ? undefined : this.searchRecebido,
      this.searchDataInicio === null ? undefined : this.searchDataInicio,
      this.searchDataFim === null ? undefined : this.searchDataFim
    ).subscribe(
      (response: PageIndicado) => {
        this.indicados = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading indicados', error);
        this.isLoading = false;
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadIndicados(this.currentPage, this.pageSize);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadIndicados(this.currentPage, this.pageSize);
  }

  searchIndicados(): void {
    this.currentPage = 0;
    this.loadIndicados(this.currentPage, this.pageSize);
  }

  clearSearch(): void {
    this.searchPago = null;
    this.searchRecebido = null;
    this.searchDataInicio = null;
    this.searchDataFim = null;
    this.currentPage = 0;
    this.loadIndicados(this.currentPage, this.pageSize);
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
    this.loadIndicados(this.currentPage, this.pageSize);
  }

  deleteIndicado(id: number): void {
    if (confirm('Tem certeza que deseja excluir este indicado?')) {
      this.indicadoService.deleteIndicado(id).subscribe(() => {
        this.loadIndicados(this.currentPage, this.pageSize);
      });
    }
  }
}