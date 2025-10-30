import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Grupo } from '../grupo.model';
import { GrupoService } from '../grupo.service';
import { ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-grupos-list',
  templateUrl: './grupos-list.component.html',
  styleUrls: ['./grupos-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, GridModule, TableModule, ButtonModule]
})
export class GruposListComponent implements OnInit {

  grupos: Grupo[] = [];

  constructor(private grupoService: GrupoService) { }

  ngOnInit(): void {
    this.loadGrupos();
  }

  loadGrupos(): void {
    this.grupoService.getGrupos().subscribe(grupos => {
      this.grupos = grupos;
    });
  }

  deleteGrupo(id: number): void {
    if (confirm('Tem certeza que deseja excluir este grupo?')) {
      this.grupoService.deleteGrupo(id).subscribe(() => {
        this.loadGrupos();
      });
    }
  }
}
