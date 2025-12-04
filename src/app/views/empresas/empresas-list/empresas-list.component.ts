import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Empresa } from '../empresa.model';
import { EmpresaService } from '../empresa.service';
import {
  ButtonModule,
  CardModule,
  GridModule,
  TableModule,
  PaginationModule,
  FormModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-empresas-list',
  templateUrl: './empresas-list.component.html',
  styleUrls: ['./empresas-list.component.scss'],
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
    IconModule
  ]
})
export class EmpresasListComponent implements OnInit {

  empresas: Empresa[] = [];
  filteredEmpresas: Empresa[] = [];
  paginatedEmpresas: Empresa[] = [];
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Filters
  searchRazaoSocial: string = '';
  searchCnpj: string = '';

  constructor(private empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.loadEmpresas();
  }

  loadEmpresas(): void {
    this.isLoading = true;
    this.empresaService.getEmpresas().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar empresas', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredEmpresas = this.empresas.filter(empresa => {
      const matchRazaoSocial = !this.searchRazaoSocial || (empresa.razaoSocial && empresa.razaoSocial.toLowerCase().includes(this.searchRazaoSocial.toLowerCase()));
      const matchCnpj = !this.searchCnpj || (empresa.cnpj && empresa.cnpj.toLowerCase().includes(this.searchCnpj.toLowerCase()));
      return matchRazaoSocial && matchCnpj;
    });

    this.totalPages = Math.ceil(this.filteredEmpresas.length / this.pageSize);
    this.currentPage = 0; // Reset to first page
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedEmpresas = this.filteredEmpresas.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  clearSearch(): void {
    this.searchRazaoSocial = '';
    this.searchCnpj = '';
    this.applyFilters();
  }

  deleteEmpresa(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      this.empresaService.deleteEmpresa(id).subscribe(() => {
        this.loadEmpresas();
      });
    }
  }
}
