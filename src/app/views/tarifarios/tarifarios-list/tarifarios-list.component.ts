import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Tarifario } from '../tarifario.model';
import { TarifarioService } from '../tarifario.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-tarifarios-list',
  templateUrl: './tarifarios-list.component.html',
  styleUrls: ['./tarifarios-list.component.scss'],
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
export class TarifariosListComponent implements OnInit {

  tarifarios: Tarifario[] = [];

  constructor(
    private tarifarioService: TarifarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTarifarios();
  }

  loadTarifarios(): void {
    this.tarifarioService.getTarifarios().subscribe(data => {
      this.tarifarios = data;
    });
  }

  excluirTarifario(id: number): void {
    if (confirm('Tem certeza que deseja excluir este tarifário?')) {
      // Implement delete method in service
      // this.tarifarioService.deleteTarifario(id).subscribe(() => {
      //   this.loadTarifarios();
      // });
      alert('Funcionalidade de exclusão não implementada no serviço.');
    }
  }
}
