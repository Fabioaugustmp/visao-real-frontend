import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Empresa } from '../empresa.model';
import { EmpresaService } from '../empresa.service';
import { ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-empresas-list',
  templateUrl: './empresas-list.component.html',
  styleUrls: ['./empresas-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, GridModule, TableModule, ButtonModule]
})
export class EmpresasListComponent implements OnInit {

  empresas: Empresa[] = [];

  constructor(private empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.loadEmpresas();
  }

  loadEmpresas(): void {
    this.empresaService.getEmpresas().subscribe(empresas => {
      this.empresas = empresas;
    });
  }

  deleteEmpresa(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta empresa?')) {
      this.empresaService.deleteEmpresa(id).subscribe(() => {
        this.loadEmpresas();
      });
    }
  }
}
