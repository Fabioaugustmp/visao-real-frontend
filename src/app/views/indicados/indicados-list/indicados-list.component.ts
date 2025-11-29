import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Indicado, PageIndicado, Pageable } from '../indicado.model';
import { IndicadoService } from '../indicado.service';
import { CommonModule } from '@angular/common';
import { BadgeModule, ButtonModule, CardModule, GridModule, TableModule, PaginationModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-indicados-list',
  templateUrl: './indicados-list.component.html',
  styleUrls: ['./indicados-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    PaginationModule,
    IconModule
  ]
})
export class IndicadosListComponent implements OnInit {

  indicados: Indicado[] = [];
  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;
  sort: string[] = ['id,desc']; // Default sort

  constructor(
    private indicadoService: IndicadoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadIndicados(this.currentPage, this.pageSize);
  }

  loadIndicados(page: number, size: number): void {
    const pageable: Pageable = { page, size, sort: this.sort };
    this.indicadoService.getIndicados(pageable).subscribe(
      (response: PageIndicado) => {
        this.indicados = response.content;
        this.totalElements = response.totalElements;
        this.totalPages = response.totalPages;
        this.currentPage = response.number;
      },
      error => {
        console.error('Error loading indicados', error);
      }
    );
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadIndicados(page, this.pageSize);
    }
  }

  excluirIndicado(id: number): void {
    if (confirm('Tem certeza que deseja excluir este indicado?')) {
      this.indicadoService.deleteIndicado(id).subscribe(() => {
        this.loadIndicados(this.currentPage, this.pageSize);
      });
    }
  }
}
