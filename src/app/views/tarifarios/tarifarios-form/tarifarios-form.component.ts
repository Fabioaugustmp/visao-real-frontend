import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TarifarioService } from '../tarifario.service';
import { Tarifario } from '../tarifario.model';
import { Medico } from '../../medicos/medico.model';
import { MedicoService } from '../../medicos/medico.service';
import { Bandeira } from '../../bandeiras/bandeira.model';
import { BandeiraService } from '../../bandeiras/bandeira.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { ValidationFeedbackComponent } from '../../../components/validation-feedback/validation-feedback.component';

@Component({
  selector: 'app-tarifarios-form',
  templateUrl: './tarifarios-form.component.html',
  styleUrls: ['./tarifarios-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    GridModule,
    FormModule,
    ButtonModule,
    ValidationFeedbackComponent
  ]
})
export class TarifariosFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  tarifarioId: number | null = null;
  medicos: Medico[] = [];
  bandeiras: Bandeira[] = [];

  constructor(
    private fb: FormBuilder,
    private tarifarioService: TarifarioService,
    private medicoService: MedicoService,
    private bandeiraService: BandeiraService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      medico: [null, Validators.required],
      bandeira: [null, Validators.required],
      titulo: [null, Validators.required],
      percentualTarifa: [null, Validators.required],
      dataInicioVigencia: [null, Validators.required],
      dataFimVigencia: [null]
    });
  }

  ngOnInit(): void {
    this.loadMedicos();
    this.loadBandeiras();
    this.tarifarioId = this.route.snapshot.params['id'];
    if (this.tarifarioId) {
      this.isEditMode = true;
      this.tarifarioService.getTarifario(this.tarifarioId).subscribe(data => {
        this.form.patchValue({
          ...data,
          medico: data.medico ? data.medico.id : null,
          bandeira: data.bandeira ? data.bandeira.id : null,
          titulo: data.titulo
        });
      });
    }
  }

  loadMedicos(): void {
    this.medicoService.getMedicos().subscribe(data => {
      this.medicos = data;
    });
  }

  loadBandeiras(): void {
    this.bandeiraService.getBandeiras().subscribe(data => {
      this.bandeiras = data;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const selectedMedico = this.medicos.find(m => m.id === +formValue.medico);
      const selectedBandeira = this.bandeiras.find(b => b.id === +formValue.bandeira);
      const tarifario: Tarifario = {
        id: formValue.id,
        medico: selectedMedico!,
        bandeira: selectedBandeira!,
        titulo: formValue.titulo,
        percentualTarifa: formValue.percentualTarifa,
        dataInicioVigencia: formValue.dataInicioVigencia,
        dataFimVigencia: formValue.dataFimVigencia
      };

      if (this.isEditMode) {
        this.tarifarioService.updateTarifario(tarifario).subscribe(() => {
          this.router.navigate(['/tarifarios']);
        });
      } else {
        this.tarifarioService.createTarifario(tarifario).subscribe(() => {
          this.router.navigate(['/tarifarios']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/tarifarios']);
  }
}
