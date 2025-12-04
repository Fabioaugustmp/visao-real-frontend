import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContadorService } from '../contador.service';
import { Contador } from '../contador.model';
import { ButtonModule, CardModule, FormModule, GridModule, AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { EmpresaService } from '../../empresas/empresa.service';
import { Empresa } from '../../empresas/empresa.model';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-contadores-form',
  templateUrl: './contadores-form.component.html',
  styleUrls: ['./contadores-form.component.scss'],
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
export class ContadoresFormComponent implements OnInit {

  contadorForm!: FormGroup;
  isEditMode = false;
  contadorId!: number;
  ufs: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];
  empresas: Empresa[] = [];

  constructor(
    private fb: FormBuilder,
    private contadorService: ContadorService,
    private empresaService: EmpresaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadEmpresas();
    this.checkMode();
  }

  get f(): { [key: string]: AbstractControl } { return this.contadorForm.controls; }

  initForm(): void {
    this.contadorForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      crc: ['', [Validators.required, Validators.maxLength(11), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      crcUf: ['', Validators.required],
      empresaId: ['']
    });
  }

  loadEmpresas(): void {
    this.empresaService.getEmpresas().subscribe(empresas => {
      this.empresas = empresas;
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.contadorId = +params['id'];
        this.contadorService.getContador(this.contadorId).subscribe(contador => {
          this.contadorForm.patchValue(contador);
          if (contador.empresa && contador.empresa.id) {
            this.contadorForm.patchValue({ empresaId: contador.empresa.id });
          }
        });
      }
    });
  }

  onSubmit(): void {
    if (this.contadorForm.valid) {
      const contadorData: Contador = this.contadorForm.value;
      if (this.isEditMode) {
        contadorData.id = this.contadorId;
      }

      const handleErrors = catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error && typeof error.error === 'object') {
          for (const key in error.error) {
            if (this.contadorForm.controls[key]) {
              this.contadorForm.controls[key].setErrors({ backend: error.error[key] });
            }
          }
        }
        return throwError(() => error);
      });

      if (this.isEditMode) {
        this.contadorService.updateContador(contadorData).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/contadores']);
        });
      } else {
        this.contadorService.createContador(contadorData).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/contadores']);
        });
      }
    } else {
      this.contadorForm.markAllAsTouched();
    }
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    if (this.contadorForm.invalid && (this.contadorForm.dirty || this.contadorForm.touched)) {
      Object.keys(this.contadorForm.controls).forEach(key => {
        const control = this.contadorForm.get(key);
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
      email: 'Email',
      crc: 'CRC',
      crcUf: 'UF',
      empresaId: 'Empresa'
    };

    const fieldName = fieldNames[controlName] || controlName;

    switch (errorName) {
      case 'required':
        return `${fieldName} é obrigatório.`;
      case 'email':
        return `${fieldName} inválido.`;
      case 'maxlength':
        return `${fieldName} deve ter no máximo 11 caracteres.`;
      case 'pattern':
        return `${fieldName} deve ser alfanumérico.`;
      case 'backend':
        return `${fieldName}: ${errorValue}`;
      default:
        return `${fieldName} é inválido.`;
    }
  }
}
