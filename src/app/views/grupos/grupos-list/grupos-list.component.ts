import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Grupo } from '../grupo.model';
import { GrupoService } from '../grupo.service';
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
  selector: 'app-grupos-list',
  templateUrl: './grupos-list.component.html',
  styleUrls: ['./grupos-list.component.scss'],
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
export class GruposListComponent implements OnInit {

  grupos: Grupo[] = [];
  filteredGrupos: Grupo[] = [];
  paginatedGrupos: Grupo[] = [];
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Filters
  searchNome: string = '';

  constructor(private grupoService: GrupoService) { }

  ngOnInit(): void {
    this.loadGrupos();
  }

  loadGrupos(): void {
    this.isLoading = true;
    this.grupoService.getGrupos().subscribe({
      next: (grupos) => {
        this.grupos = grupos;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar grupos', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredGrupos = this.grupos.filter(grupo => {
      const matchNome = !this.searchNome || (grupo.nomeGrupo && grupo.nomeGrupo.toLowerCase().includes(this.searchNome.toLowerCase()));
      return matchNome;
    });

    this.totalPages = Math.ceil(this.filteredGrupos.length / this.pageSize);
    this.currentPage = 0;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedGrupos = this.filteredGrupos.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  clearSearch(): void {
    this.searchNome = '';
    this.applyFilters();
  }

  deleteGrupo(id: number): void {
    if (confirm('Tem certeza que deseja excluir este grupo?')) {
      this.grupoService.deleteGrupo(id).subscribe(() => {
        this.loadGrupos();
      });
    }
  }
}
