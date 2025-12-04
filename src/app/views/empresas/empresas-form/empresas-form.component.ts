import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmpresaService } from '../empresa.service';
import { Empresa } from '../empresa.model';
import { Contador } from '../../contadores/contador.model';
import { ContadorService } from '../../contadores/contador.service';
import {
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  AlertModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-empresas-form',
  templateUrl: './empresas-form.component.html',
  styleUrls: ['./empresas-form.component.scss'],
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
    IconModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()]
})
export class EmpresasFormComponent implements OnInit {

  empresaForm!: FormGroup;
  isEditMode = false;
  empresaId!: number;
  contadores: Contador[] = [];

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private contadorService: ContadorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadContadores();
    this.checkMode();
  }

  initForm(): void {
    this.empresaForm = this.fb.group({
      cnpj: ['', Validators.required],
      razaoSocial: ['', Validators.required],
      idContratoCartao: ['', Validators.required],
      contador: [null, Validators.required]
    });
  }

  loadContadores(): void {
    this.contadorService.getContadores().subscribe(contadores => {
      this.contadores = contadores;
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.empresaId = +params['id'];
        this.empresaService.getEmpresa(this.empresaId).subscribe(empresa => {
          this.empresaForm.patchValue({
            ...empresa,
            contador: empresa.contador.id
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.empresaForm.valid) {
      const formValue = this.empresaForm.value;
      const selectedContador = this.contadores.find(c => c.id === +formValue.contador);
      const empresaData: Empresa = {
        id: this.empresaId,
        cnpj: formValue.cnpj,
        razaoSocial: formValue.razaoSocial,
        idContratoCartao: formValue.idContratoCartao,
        contador: selectedContador!
      };

      const handleErrors = catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error && typeof error.error === 'object') {
          for (const key in error.error) {
            if (this.empresaForm.controls[key]) {
              this.empresaForm.controls[key].setErrors({ backend: error.error[key] });
            }
          }
        }
        return throwError(() => error);
      });

      if (this.isEditMode) {
        this.empresaService.updateEmpresa(empresaData).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/empresas']);
        });
      } else {
        this.empresaService.createEmpresa(empresaData).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/empresas']);
        });
      }
    } else {
      this.empresaForm.markAllAsTouched();
    }
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    if (this.empresaForm.invalid && (this.empresaForm.dirty || this.empresaForm.touched)) {
      Object.keys(this.empresaForm.controls).forEach(key => {
        const control = this.empresaForm.get(key);
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
      cnpj: 'CNPJ',
      razaoSocial: 'Razão Social',
      idContratoCartao: 'Contrato Cartão',
      contador: 'Contador'
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
}
