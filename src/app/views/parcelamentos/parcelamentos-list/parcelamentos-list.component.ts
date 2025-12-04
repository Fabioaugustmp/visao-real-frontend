import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Parcelamento } from '../parcelamento.model';
import { ParcelamentoService } from '../parcelamento.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ButtonModule,
  CardModule,
  GridModule,
  TableModule,
  PaginationModule,
  FormModule,
  BadgeModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-parcelamentos-list',
  templateUrl: './parcelamentos-list.component.html',
  styleUrls: ['./parcelamentos-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    GridModule,
    TableModule,
    ButtonModule,
    PaginationModule,
    FormModule,
    IconModule,
    BadgeModule
  ]
})
export class ParcelamentosListComponent implements OnInit {

  parcelamentos: Parcelamento[] = [];
  filteredParcelamentos: Parcelamento[] = [];
  paginatedParcelamentos: Parcelamento[] = [];
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Filters
  searchDescricao: string = '';

  constructor(
    private parcelamentoService: ParcelamentoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadParcelamentos();
  }

  loadParcelamentos(): void {
    this.isLoading = true;
    this.parcelamentoService.getParcelamentos().subscribe({
      next: (data) => {
        this.parcelamentos = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar parcelamentos', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredParcelamentos = this.parcelamentos.filter(p => {
      const matchDescricao = !this.searchDescricao || (p.descricao && p.descricao.toLowerCase().includes(this.searchDescricao.toLowerCase()));
      return matchDescricao;
    });

    this.totalPages = Math.ceil(this.filteredParcelamentos.length / this.pageSize);
    this.currentPage = 0;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedParcelamentos = this.filteredParcelamentos.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  clearSearch(): void {
    this.searchDescricao = '';
    this.applyFilters();
  }

  excluirParcelamento(id: number): void {
    if (confirm('Tem certeza que deseja excluir este parcelamento?')) {
      this.parcelamentoService.deleteParcelamento(id).subscribe(() => {
        this.loadParcelamentos();
      });
    }
  }
}
