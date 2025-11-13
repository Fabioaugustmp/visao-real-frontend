import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Financeiro } from '../financeiro.model';
import { FinanceiroService } from '../financeiro.service';
import { CommonModule } from '@angular/common';
import { BadgeModule, ButtonModule, CardModule, GridModule, PaginationModule, TableModule } from '@coreui/angular';

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
    BadgeModule,
    PaginationModule
  ]
})
export class FinanceirosListComponent implements OnInit {

  financeiros: Financeiro[] = [];
  currentPage = 0;
  size = 10;
  totalElements = 0;
  totalPages = 0;

  constructor(
    private financeiroService: FinanceiroService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFinanceiros();
  }

  loadFinanceiros(): void {
    this.financeiroService.getFinanceiros(this.currentPage, this.size).subscribe(data => {
      this.financeiros = data.content;
      this.totalElements = data.totalElements;
      this.totalPages = data.totalPages;
      this.currentPage = data.number;
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadFinanceiros();
  }

  excluirFinanceiro(id: number): void {
    if (confirm('Tem certeza que deseja excluir este registro financeiro?')) {
      this.financeiroService.deleteFinanceiro(id).subscribe(() => {
        this.loadFinanceiros();
      });
    }
  }
}
