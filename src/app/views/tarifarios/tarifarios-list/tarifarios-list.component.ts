import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Tarifario } from '../tarifario.model';
import { TarifarioService } from '../tarifario.service';
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
  selector: 'app-tarifarios-list',
  templateUrl: './tarifarios-list.component.html',
  styleUrls: ['./tarifarios-list.component.scss'],
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
export class TarifariosListComponent implements OnInit {

  tarifarios: Tarifario[] = [];
  filteredTarifarios: Tarifario[] = [];
  paginatedTarifarios: Tarifario[] = [];
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Filters
  searchTitulo: string = '';
  searchMedico: string = '';
  searchBandeira: string = '';

  constructor(
    private tarifarioService: TarifarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTarifarios();
  }

  loadTarifarios(): void {
    this.isLoading = true;
    this.tarifarioService.getTarifarios().subscribe({
      next: (data) => {
        this.tarifarios = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tarifários', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredTarifarios = this.tarifarios.filter(t => {
      const matchTitulo = !this.searchTitulo || (t.titulo && t.titulo.toLowerCase().includes(this.searchTitulo.toLowerCase()));
      const matchMedico = !this.searchMedico || (t.medico && t.medico.nome.toLowerCase().includes(this.searchMedico.toLowerCase()));
      const matchBandeira = !this.searchBandeira || (t.bandeira && t.bandeira.bandeira.toLowerCase().includes(this.searchBandeira.toLowerCase()));
      return matchTitulo && matchMedico && matchBandeira;
    });

    this.totalPages = Math.ceil(this.filteredTarifarios.length / this.pageSize);
    this.currentPage = 0;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedTarifarios = this.filteredTarifarios.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  clearSearch(): void {
    this.searchTitulo = '';
    this.searchMedico = '';
    this.searchBandeira = '';
    this.applyFilters();
  }

  excluirTarifario(id: number): void {
    if (confirm('Tem certeza que deseja excluir este tarifário?')) {
      // Implement delete method in service if available
      // this.tarifarioService.deleteTarifario(id).subscribe(() => {
      //   this.loadTarifarios();
      // });
      alert('Funcionalidade de exclusão não implementada no serviço.');
    }
  }
}
