import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormaPagamento } from '../forma-pagamento.model';
import { FormaPagamentoService } from '../forma-pagamento.service';
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
  selector: 'app-formas-pagamento-list',
  templateUrl: './formas-pagamento-list.component.html',
  styleUrls: ['./formas-pagamento-list.component.scss'],
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
export class FormasPagamentoListComponent implements OnInit {

  formasPagamento: FormaPagamento[] = [];
  filteredFormasPagamento: FormaPagamento[] = [];
  paginatedFormasPagamento: FormaPagamento[] = [];
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Filters
  searchNome: string = '';
  searchDescricao: string = '';

  constructor(
    private formaPagamentoService: FormaPagamentoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFormasPagamento();
  }

  loadFormasPagamento(): void {
    this.isLoading = true;
    this.formaPagamentoService.getFormasPagamento().subscribe({
      next: (data) => {
        this.formasPagamento = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar formas de pagamento', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredFormasPagamento = this.formasPagamento.filter(f => {
      const matchNome = !this.searchNome || (f.nome && f.nome.toLowerCase().includes(this.searchNome.toLowerCase()));
      const matchDescricao = !this.searchDescricao || (f.descricao && f.descricao.toLowerCase().includes(this.searchDescricao.toLowerCase()));
      return matchNome && matchDescricao;
    });

    this.totalPages = Math.ceil(this.filteredFormasPagamento.length / this.pageSize);
    this.currentPage = 0;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedFormasPagamento = this.filteredFormasPagamento.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  clearSearch(): void {
    this.searchNome = '';
    this.searchDescricao = '';
    this.applyFilters();
  }

  excluirFormaPagamento(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta forma de pagamento?')) {
      this.formaPagamentoService.deleteFormaPagamento(id).subscribe(() => {
        this.loadFormasPagamento();
      });
    }
  }
}
