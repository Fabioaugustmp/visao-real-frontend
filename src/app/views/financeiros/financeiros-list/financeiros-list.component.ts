import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Financeiro } from '../financeiro.model';
import { FinanceiroService } from '../financeiro.service';
import { CommonModule } from '@angular/common';
import { BadgeModule, ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-financeiros-list',
  templateUrl: './financeiros-list.component.html',
  styleUrls: ['./financeiros-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    TableModule,
    ButtonModule,
    BadgeModule
  ]
})
export class FinanceirosListComponent implements OnInit {

  financeiros: Financeiro[] = [];

  constructor(
    private financeiroService: FinanceiroService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFinanceiros();
  }

  loadFinanceiros(): void {
    this.financeiroService.getFinanceiros().subscribe(data => {
      this.financeiros = data;
    });
  }

  excluirFinanceiro(id: number): void {
    if (confirm('Tem certeza que deseja excluir este registro financeiro?')) {
      this.financeiroService.deleteFinanceiro(id).subscribe(() => {
        this.loadFinanceiros();
      });
    }
  }
}
