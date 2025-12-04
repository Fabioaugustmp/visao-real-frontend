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
import { ButtonModule, CardModule, FormModule, GridModule, AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

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
    AlertModule,
    IconModule
  ]
})
export class TarifariosFormComponent implements OnInit {

  form!: FormGroup;
  isEditMode = false;
  tarifarioId: number | null = null;
  medicos: Medico[] = [];
  bandeiras: Bandeira[] = [];
  medicoNome: string = '';

  constructor(
    private fb: FormBuilder,
    private tarifarioService: TarifarioService,
    private medicoService: MedicoService,
    private bandeiraService: BandeiraService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.tarifarioId = this.route.snapshot.params['id'];
    this.loadMedicos();
    this.loadBandeiras();
    if (this.tarifarioId) {
      this.isEditMode = true;
      this.tarifarioService.getTarifario(this.tarifarioId).subscribe(data => {
        const dataInicio = data.dataInicioVigencia ? new Date(data.dataInicioVigencia).toISOString().split('T')[0] : null;
        const dataFim = data.dataFimVigencia ? new Date(data.dataFimVigencia).toISOString().split('T')[0] : null;
        this.medicoNome = data.medico ? `${data.medico.nome} - ${data.medico.crm}` : '';

        this.form.patchValue({
          id: data.id,
          medico: null,
          bandeira: data.bandeira ? data.bandeira.id : null,
          titulo: data.titulo,
          percentualTarifa: data.percentualTarifa,
          dataInicioVigencia: dataInicio,
          dataFimVigencia: dataFim
        });

        this.form.get('medico')?.disable();
      });
    }
  }

  initForm(): void {
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

      const handleErrors = catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error && typeof error.error === 'object') {
          for (const key in error.error) {
            if (this.form.controls[key]) {
              this.form.controls[key].setErrors({ backend: error.error[key] });
            }
          }
        }
        return throwError(() => error);
      });

      if (this.isEditMode) {
        this.tarifarioService.updateTarifario(tarifario).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/tarifarios']);
        });
      } else {
        this.tarifarioService.createTarifario(tarifario).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/tarifarios']);
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    if (this.form.invalid && (this.form.dirty || this.form.touched)) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control && control.invalid && (control.dirty || control.touched)) {
          const controlErrors = control.errors;
          if (controlErrors) {
            Object.keys(controlErrors).forEach(errorKey => {
              const errorMessage = this.getErrorMessage(key, errorKey, controlErrors[errorKey]);
              if (errorMessage) {
                errors.push(errorMessage);
              }
            });
          }
        }
      });
    }
    return errors;
  }

  getErrorMessage(controlName: string, errorName: string, errorValue: any): string | null {
    const fieldNames: { [key: string]: string } = {
      medico: 'Médico',
      bandeira: 'Bandeira',
      titulo: 'Título',
      percentualTarifa: 'Percentual Tarifa',
      dataInicioVigencia: 'Início Vigência'
    };

    const fieldName = fieldNames[controlName] || controlName;

    switch (errorName) {
      case 'required':
        return `${fieldName} é obrigatório.`;
      case 'backend':
        return `${fieldName}: ${errorValue}`;
      default:
        return `${fieldName} é inválido.`;
    }
  }

  cancelar(): void {
    this.router.navigate(['/tarifarios']);
  }
}
