import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ParcelamentoService } from '../parcelamento.service';
import { Parcelamento } from '../parcelamento.model';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, FormModule, GridModule, AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-parcelamentos-form',
  templateUrl: './parcelamentos-form.component.html',
  styleUrls: ['./parcelamentos-form.component.scss'],
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
export class ParcelamentosFormComponent implements OnInit {

  form!: FormGroup;
  isEditMode = false;
  parcelamentoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private parcelamentoService: ParcelamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.parcelamentoId = this.route.snapshot.params['id'];
    if (this.parcelamentoId) {
      this.isEditMode = true;
      this.parcelamentoService.getParcelamento(this.parcelamentoId).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      descricao: ['', Validators.required],
      numeroDeParcelas: [null, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const parcelamento: Parcelamento = this.form.value;

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
        this.parcelamentoService.updateParcelamento(parcelamento).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/parcelamentos']);
        });
      } else {
        this.parcelamentoService.createParcelamento(parcelamento).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/parcelamentos']);
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
      descricao: 'Descrição',
      numeroDeParcelas: 'Número de Parcelas'
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
    this.router.navigate(['/parcelamentos']);
  }
}
