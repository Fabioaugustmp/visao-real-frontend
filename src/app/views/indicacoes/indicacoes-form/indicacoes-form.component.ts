import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IndicacaoService } from '../indicacao.service';
import { Indicacao } from '../indicacao.model';
import { Medico } from '../../medicos/medico.model';
import { MedicoService } from '../../medicos/medico.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-indicacoes-form',
  templateUrl: './indicacoes-form.component.html',
  styleUrls: ['./indicacoes-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    GridModule,
    FormModule,
    ButtonModule
  ]
})
export class IndicacoesFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  indicacaoId: number | null = null;
  medicos: Medico[] = [];

  constructor(
    private fb: FormBuilder,
    private indicacaoService: IndicacaoService,
    private medicoService: MedicoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      medico: [null, Validators.required],
      tipo: ['', Validators.required],
      valorIndicacao: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadMedicos();
    this.indicacaoId = this.route.snapshot.params['id'];
    if (this.indicacaoId) {
      this.isEditMode = true;
      this.indicacaoService.getIndicacao(this.indicacaoId).subscribe(data => {
        this.form.patchValue({
          ...data,
          medico: data.medico.id
        });
      });
    }
  }

  loadMedicos(): void {
    this.medicoService.getMedicos().subscribe(data => {
      this.medicos = data;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const selectedMedico = this.medicos.find(m => m.id === +formValue.medico);
      const indicacao: Indicacao = {
        id: formValue.id,
        medico: selectedMedico!,
        tipo: formValue.tipo,
        valorIndicacao: formValue.valorIndicacao
      };

      if (this.isEditMode) {
        this.indicacaoService.updateIndicacao(indicacao).subscribe(() => {
          this.router.navigate(['/indicacoes']);
        });
      } else {
        this.indicacaoService.createIndicacao(indicacao).subscribe(() => {
          this.router.navigate(['/indicacoes']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/indicacoes']);
  }
}
