import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Medico } from '../medico.model';
import { MedicoService } from '../medico.service';
import { ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-medicos-list',
  templateUrl: './medicos-list.component.html',
  styleUrls: ['./medicos-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, GridModule, TableModule, ButtonModule]
})
export class MedicosListComponent implements OnInit {

  medicos: Medico[] = [];

  constructor(private medicoService: MedicoService) { }

  ngOnInit(): void {
    this.loadMedicos();
  }

  loadMedicos(): void {
    this.medicoService.getMedicos().subscribe(medicos => {
      this.medicos = medicos;
    });
  }

  deleteMedico(id: number): void {
    if (confirm('Tem certeza que deseja excluir este médico?')) {
      this.medicoService.deleteMedico(id).subscribe(() => {
        this.loadMedicos();
      });
    }
  }
}
