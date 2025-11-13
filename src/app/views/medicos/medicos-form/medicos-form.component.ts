import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MedicoService } from '../medico.service';
import { Medico } from '../medico.model';
import { Empresa } from '../../empresas/empresa.model';
import { Usuario } from '../../usuarios/usuario.model';
import { EmpresaService } from '../../empresas/empresa.service';
import { UsuarioService } from '../../usuarios/usuario.service';
import { ButtonModule, CardModule, FormModule, GridModule, AlertModule } from '@coreui/angular';
import { ValidationFeedbackComponent } from '../../../components/validation-feedback/validation-feedback.component';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-medicos-form',
  templateUrl: './medicos-form.component.html',
  styleUrls: ['./medicos-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule, ValidationFeedbackComponent, AlertModule]
})
export class MedicosFormComponent implements OnInit {

  medicoForm!: FormGroup;
  isEditMode = false;
  medicoId!: number;
  empresas: Empresa[] = [];
  usuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private medicoService: MedicoService,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadEmpresas();
    this.loadUsuarios();
    this.checkMode();
  }

  initForm(): void {
    this.medicoForm = this.fb.group({
      crm: ['', Validators.required],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dataNasc: ['', Validators.required],
      cpf: ['', Validators.required],
      taxaImposto: ['', Validators.required],
      empresa: [null, Validators.required],
      usuario: [null, Validators.required]
    });
  }

  loadEmpresas(): void {
    this.empresaService.getEmpresas().subscribe(empresas => {
      this.empresas = empresas;
    });
  }

  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.medicoId = +params['id'];
        this.medicoService.getMedico(this.medicoId).subscribe(medico => {
          this.medicoForm.patchValue({
            ...medico,
            empresa: medico.empresa.id,
            usuario: medico.usuario.id
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.medicoForm.valid) {
      const formValue = this.medicoForm.value;
      const selectedEmpresa = this.empresas.find(e => e.id === +formValue.empresa);
      const selectedUsuario = this.usuarios.find(u => u.id === +formValue.usuario);

      const medicoData: Medico = {
        id: this.medicoId,
        crm: formValue.crm,
        nome: formValue.nome,
        email: formValue.email,
        dataNasc: formValue.dataNasc,
        cpf: formValue.cpf,
        taxaImposto: formValue.taxaImposto,
        empresa: selectedEmpresa!,
        usuario: selectedUsuario!
      };

      const handleErrors = catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error && typeof error.error === 'object') {
          for (const key in error.error) {
            if (this.medicoForm.controls[key]) {
              this.medicoForm.controls[key].setErrors({ backend: error.error[key] });
            }
          }
        }
        return throwError(() => error);
      });

      if (this.isEditMode) {
        this.medicoService.updateMedico(medicoData).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/medicos']);
        });
      } else {
        this.medicoService.createMedico(medicoData).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/medicos']);
        });
      }
    }
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    if (this.medicoForm.invalid && (this.medicoForm.dirty || this.medicoForm.touched)) {
      Object.keys(this.medicoForm.controls).forEach(key => {
        const control = this.medicoForm.get(key);
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
      crm: 'CRM',
      nome: 'Nome',
      email: 'Email',
      dataNasc: 'Data de Nascimento',
      cpf: 'CPF',
      taxaImposto: 'Taxa de Imposto',
      empresa: 'Empresa',
      usuario: 'Usuário'
    };

    const fieldName = fieldNames[controlName] || controlName;

    switch (errorName) {
      case 'required':
        return `${fieldName} é obrigatório.`;
      case 'email':
        return `${fieldName} inválido.`;
      case 'backend':
        return `${fieldName}: ${errorValue}`;
      default:
        return `${fieldName} é inválido.`;
    }
  }
}

