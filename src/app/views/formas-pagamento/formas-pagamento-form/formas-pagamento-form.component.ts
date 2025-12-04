import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormaPagamentoService } from '../forma-pagamento.service';
import { FormaPagamento, NomeFormaPagamento } from '../forma-pagamento.model';
import { Parcelamento } from '../../parcelamentos/parcelamento.model';
import { ParcelamentoService } from '../../parcelamentos/parcelamento.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, FormModule, GridModule, AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-formas-pagamento-form',
  templateUrl: './formas-pagamento-form.component.html',
  styleUrls: ['./formas-pagamento-form.component.scss'],
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
export class FormasPagamentoFormComponent implements OnInit {

  form!: FormGroup;
  isEditMode = false;
  formaPagamentoId: number | null = null;
  nomeFormaPagamentoKeys: (keyof typeof NomeFormaPagamento)[];
  NomeFormaPagamento = NomeFormaPagamento;
  parcelamentos: Parcelamento[] = [];

  constructor(
    private fb: FormBuilder,
    private formaPagamentoService: FormaPagamentoService,
    private parcelamentoService: ParcelamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.nomeFormaPagamentoKeys = Object.keys(NomeFormaPagamento) as (keyof typeof NomeFormaPagamento)[];
    this.initForm();
  }

  ngOnInit(): void {
    this.loadParcelamentos();
    this.formaPagamentoId = this.route.snapshot.params['id'];
    if (this.formaPagamentoId) {
      this.isEditMode = true;
      this.formaPagamentoService.getFormaPagamento(this.formaPagamentoId).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      idParcelamento: [null, Validators.required]
    });
  }

  loadParcelamentos(): void {
    this.parcelamentoService.getParcelamentos().subscribe(data => {
      this.parcelamentos = data;
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formaPagamento: FormaPagamento = this.form.value;

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
        this.formaPagamentoService.updateFormaPagamento(formaPagamento).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/formas-pagamento']);
        });
      } else {
        this.formaPagamentoService.createFormaPagamento(formaPagamento).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/formas-pagamento']);
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
      nome: 'Nome',
      descricao: 'Descrição',
      idParcelamento: 'Parcelamento'
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
    this.router.navigate(['/formas-pagamento']);
  }
}
