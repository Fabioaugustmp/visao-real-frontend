import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Preco } from '../preco.model';
import { PrecoService } from '../preco.service';
import { ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-precos-list',
  templateUrl: './precos-list.component.html',
  styleUrls: ['./precos-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, GridModule, TableModule, ButtonModule]
})
export class PrecosListComponent implements OnInit {

  precos: Preco[] = [];

  constructor(private precoService: PrecoService) { }

  ngOnInit(): void {
    this.loadPrecos();
  }

  loadPrecos(): void {
    this.precoService.getPrecos().subscribe(precos => {
      this.precos = precos;
    });
  }

  deletePreco(id: number): void {
    if (confirm('Tem certeza que deseja excluir este preço?')) {
      this.precoService.deletePreco(id).subscribe(() => {
        this.loadPrecos();
      });
    }
  }
}
