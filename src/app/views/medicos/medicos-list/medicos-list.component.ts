import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Medico } from '../medico.model';
import { MedicoService } from '../medico.service';
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
  selector: 'app-medicos-list',
  templateUrl: './medicos-list.component.html',
  styleUrls: ['./medicos-list.component.scss'],
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
export class MedicosListComponent implements OnInit {

  medicos: Medico[] = [];
  filteredMedicos: Medico[] = [];
  paginatedMedicos: Medico[] = [];
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Filters
  searchCrm: string = '';
  searchNome: string = '';
  searchEmail: string = '';

  // Sort
  currentSortField: string | null = null;
  isSortAsc: boolean = true;

  constructor(private medicoService: MedicoService) { }

  ngOnInit(): void {
    this.loadMedicos();
  }

  loadMedicos(): void {
    this.isLoading = true;
    this.medicoService.getMedicos().subscribe({
      next: (medicos) => {
        this.medicos = medicos;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar médicos', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredMedicos = this.medicos.filter(medico => {
      const matchCrm = !this.searchCrm || (medico.crm && medico.crm.toLowerCase().includes(this.searchCrm.toLowerCase()));
      const matchNome = !this.searchNome || (medico.nome && medico.nome.toLowerCase().includes(this.searchNome.toLowerCase()));
      const matchEmail = !this.searchEmail || (medico.email && medico.email.toLowerCase().includes(this.searchEmail.toLowerCase()));
      return matchCrm && matchNome && matchEmail;
    });

    this.totalPages = Math.ceil(this.filteredMedicos.length / this.pageSize);
    this.currentPage = 0; // Reset to first page on filter change
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedMedicos = this.filteredMedicos.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  clearSearch(): void {
    this.searchCrm = '';
    this.searchNome = '';
    this.searchEmail = '';
    this.applyFilters();
  }

  deleteMedico(id: number): void {
    if (confirm('Tem certeza que deseja excluir este médico?')) {
      this.medicoService.deleteMedico(id).subscribe(() => {
        this.loadMedicos();
      });
    }
  }
}
