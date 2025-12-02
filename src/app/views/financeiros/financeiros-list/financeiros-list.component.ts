import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Financeiro, PageFinanceiro, Pageable } from '../financeiro.model';
import { FinanceiroService } from '../financeiro.service';
import { ButtonModule, CardModule, GridModule, TableModule, PaginationModule, FormModule } from '@coreui/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-financeiros-list',
  templateUrl: './financeiros-list.component.html',
  styleUrls: ['./financeiros-list.component.scss'],
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
export class FinanceirosListComponent implements OnInit {

  financeiros: Financeiro[] = [];
  isLoading = false;
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  sort: string[] = ['id,asc'];
  currentSortField = 'id';
  isSortAsc = true;

  searchTicketId: string | null = null;

  constructor(private financeiroService: FinanceiroService) { }

  ngOnInit(): void {
    this.loadFinanceiros(this.currentPage, this.pageSize);
  }

  loadFinanceiros(page: number, size: number): void {
    this.isLoading = true;
    const pageable: Pageable = { page, size, sort: this.sort };
    this.financeiroService.getFinanceiros(pageable, this.searchTicketId ? this.searchTicketId : undefined).subscribe(
      (response: PageFinanceiro) => {
        this.financeiros = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
        this.isLoading = false;
      },
      error => {
        console.error('Error loading financeiros', error);
        this.isLoading = false;
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadFinanceiros(this.currentPage, this.pageSize);
  }

  onPageSizeChange(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadFinanceiros(this.currentPage, this.pageSize);
  }

  searchFinanceiros(): void {
    this.currentPage = 0;
    this.loadFinanceiros(this.currentPage, this.pageSize);
  }

  clearSearch(): void {
    this.searchTicketId = null;
    this.currentPage = 0;
    this.loadFinanceiros(this.currentPage, this.pageSize);
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
    this.loadFinanceiros(this.currentPage, this.pageSize);
  }

  deleteFinanceiro(id: number): void {
    if (confirm('Tem certeza que deseja excluir este registro financeiro?')) {
      this.financeiroService.deleteFinanceiro(id).subscribe(() => {
        this.loadFinanceiros(this.currentPage, this.pageSize);
      });
    }
  }
}