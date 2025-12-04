import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Bandeira } from '../bandeira.model';
import { BandeiraService } from '../bandeira.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-bandeiras-list',
  templateUrl: './bandeiras-list.component.html',
  styleUrls: ['./bandeiras-list.component.scss'],
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
export class BandeirasListComponent implements OnInit {

  bandeiras: Bandeira[] = [];
  filteredBandeiras: Bandeira[] = [];
  paginatedBandeiras: Bandeira[] = [];
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Filters
  searchBandeira: string = '';

  constructor(
    private bandeiraService: BandeiraService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBandeiras();
  }

  loadBandeiras(): void {
    this.isLoading = true;
    this.bandeiraService.getBandeiras().subscribe({
      next: (data) => {
        this.bandeiras = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar bandeiras', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredBandeiras = this.bandeiras.filter(b => {
      const matchBandeira = !this.searchBandeira || (b.bandeira && b.bandeira.toString().toLowerCase().includes(this.searchBandeira.toLowerCase()));
      return matchBandeira;
    });

    this.totalPages = Math.ceil(this.filteredBandeiras.length / this.pageSize);
    this.currentPage = 0;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedBandeiras = this.filteredBandeiras.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  clearSearch(): void {
    this.searchBandeira = '';
    this.applyFilters();
  }

  excluirBandeira(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta bandeira?')) {
      this.bandeiraService.deleteBandeira(id).subscribe(() => {
        this.loadBandeiras();
      });
    }
  }
}
