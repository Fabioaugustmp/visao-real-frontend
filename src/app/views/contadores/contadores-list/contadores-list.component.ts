import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Contador } from '../contador.model';
import { ContadorService } from '../contador.service';
import { ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-contadores-list',
  templateUrl: './contadores-list.component.html',
  styleUrls: ['./contadores-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, GridModule, TableModule, ButtonModule]
})
export class ContadoresListComponent implements OnInit {

  contadores: Contador[] = [];

  constructor(private contadorService: ContadorService) { }

  ngOnInit(): void {
    this.loadContadores();
  }

  loadContadores(): void {
    this.contadorService.getContadores().subscribe(contadores => {
      this.contadores = contadores;
    });
  }

  deleteContador(id: number): void {
    if (confirm('Tem certeza que deseja excluir este contador?')) {
      this.contadorService.deleteContador(id).subscribe(() => {
        this.loadContadores();
      });
    }
  }
}
