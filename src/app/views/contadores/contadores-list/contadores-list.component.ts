import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Contador } from '../contador.model';
import { ContadorService } from '../contador.service';
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
  selector: 'app-contadores-list',
  templateUrl: './contadores-list.component.html',
  styleUrls: ['./contadores-list.component.scss'],
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
export class ContadoresListComponent implements OnInit {

  contadores: Contador[] = [];
  filteredContadores: Contador[] = [];
  paginatedContadores: Contador[] = [];
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Filters
  searchNome: string = '';
  searchEmail: string = '';
  searchCrc: string = '';

  constructor(private contadorService: ContadorService) { }

  ngOnInit(): void {
    this.loadContadores();
  }

  loadContadores(): void {
    this.isLoading = true;
    this.contadorService.getContadores().subscribe({
      next: (contadores) => {
        this.contadores = contadores;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar contadores', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredContadores = this.contadores.filter(contador => {
      const matchNome = !this.searchNome || (contador.nome && contador.nome.toLowerCase().includes(this.searchNome.toLowerCase()));
      const matchEmail = !this.searchEmail || (contador.email && contador.email.toLowerCase().includes(this.searchEmail.toLowerCase()));
      const matchCrc = !this.searchCrc || (contador.crc && contador.crc.toLowerCase().includes(this.searchCrc.toLowerCase()));
      return matchNome && matchEmail && matchCrc;
    });

    this.totalPages = Math.ceil(this.filteredContadores.length / this.pageSize);
    this.currentPage = 0;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedContadores = this.filteredContadores.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  clearSearch(): void {
    this.searchNome = '';
    this.searchEmail = '';
    this.searchCrc = '';
    this.applyFilters();
  }

  deleteContador(id: number): void {
    if (confirm('Tem certeza que deseja excluir este contador?')) {
      this.contadorService.deleteContador(id).subscribe(() => {
        this.loadContadores();
      });
    }
  }
}
