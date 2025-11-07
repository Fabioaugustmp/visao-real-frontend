import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Parcelamento } from '../parcelamento.model';
import { ParcelamentoService } from '../parcelamento.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-parcelamentos-list',
  templateUrl: './parcelamentos-list.component.html',
  styleUrls: ['./parcelamentos-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardModule,
    GridModule,
    TableModule,
    ButtonModule
  ]
})
export class ParcelamentosListComponent implements OnInit {

  parcelamentos: Parcelamento[] = [];

  constructor(
    private parcelamentoService: ParcelamentoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadParcelamentos();
  }

  loadParcelamentos(): void {
    this.parcelamentoService.getParcelamentos().subscribe(data => {
      this.parcelamentos = data;
    });
  }

  excluirParcelamento(id: number): void {
    if (confirm('Tem certeza que deseja excluir este parcelamento?')) {
      this.parcelamentoService.deleteParcelamento(id).subscribe(() => {
        this.loadParcelamentos();
      });
    }
  }
}
