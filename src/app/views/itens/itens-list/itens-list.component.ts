import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Item } from '../item.model';
import { ItemService } from '../item.service';
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
  selector: 'app-itens-list',
  templateUrl: './itens-list.component.html',
  styleUrls: ['./itens-list.component.scss'],
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
export class ItensListComponent implements OnInit {

  itens: Item[] = [];
  filteredItens: Item[] = [];
  paginatedItens: Item[] = [];
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Filters
  searchDescricao: string = '';
  searchTipo: string = '';

  constructor(private itemService: ItemService) { }

  ngOnInit(): void {
    this.loadItens();
  }

  loadItens(): void {
    this.isLoading = true;
    this.itemService.getItens().subscribe({
      next: (itens) => {
        this.itens = itens;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar itens', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredItens = this.itens.filter(item => {
      const matchDescricao = !this.searchDescricao || (item.descricao && item.descricao.toLowerCase().includes(this.searchDescricao.toLowerCase()));
      const matchTipo = !this.searchTipo || (item.tipo && item.tipo === this.searchTipo);
      return matchDescricao && matchTipo;
    });

    this.totalPages = Math.ceil(this.filteredItens.length / this.pageSize);
    this.currentPage = 0;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedItens = this.filteredItens.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  clearSearch(): void {
    this.searchDescricao = '';
    this.searchTipo = '';
    this.applyFilters();
  }

  deleteItem(id: number): void {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      this.itemService.deleteItem(id).subscribe(() => {
        this.loadItens();
      });
    }
  }
}
