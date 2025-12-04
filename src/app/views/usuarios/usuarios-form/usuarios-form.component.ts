import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario.model';
import { Perfil } from '../perfil.model';
import { PerfilService } from '../perfil.service';
import { ButtonModule, CardModule, FormModule, GridModule, AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.scss'],
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
export class UsuariosFormComponent implements OnInit {

  usuarioForm!: FormGroup;
  isEditMode = false;
  usuarioId!: number;
  perfis: Perfil[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private perfilService: PerfilService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPerfis();
    this.checkMode();
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      login: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      perfis: [[], Validators.required],
      password: ['', Validators.required],
      status: [true]
    });
  }

  loadPerfis(): void {
    this.perfilService.getPerfis().subscribe(perfis => {
      this.perfis = perfis;
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.usuarioId = +params['id'];
        this.usuarioForm.get('password')?.clearValidators();
        this.usuarioForm.get('password')?.updateValueAndValidity();
        this.usuarioService.getUsuario(this.usuarioId).subscribe(usuario => {
          this.usuarioForm.patchValue({
            ...usuario,
            perfis: usuario.perfis.map(p => p.id)
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const formValue = this.usuarioForm.value;
      // Handle the case where perfis might be numbers (IDs) or objects depending on the select control behavior
      const selectedPerfisIds = Array.isArray(formValue.perfis) ? formValue.perfis.map((p: any) => Number(p)) : [];
      const selectedPerfis = this.perfis.filter(p => selectedPerfisIds.includes(p.id));

      const usuarioData: Usuario = {
        id: this.usuarioId,
        nome: formValue.nome,
        login: formValue.login,
        email: formValue.email,
        perfis: selectedPerfis,
        password: formValue.password,
        status: formValue.status,
        dataCriacao: new Date() // Ideally backend handles this
      };

      const handleErrors = catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error && typeof error.error === 'object') {
          for (const key in error.error) {
            if (this.usuarioForm.controls[key]) {
              this.usuarioForm.controls[key].setErrors({ backend: error.error[key] });
            }
          }
        }
        return throwError(() => error);
      });

      if (this.isEditMode) {
        this.usuarioService.updateUsuario(usuarioData).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/usuarios']);
        });
      } else {
        this.usuarioService.createUsuario(usuarioData).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/usuarios']);
        });
      }
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    if (this.usuarioForm.invalid && (this.usuarioForm.dirty || this.usuarioForm.touched)) {
      Object.keys(this.usuarioForm.controls).forEach(key => {
        const control = this.usuarioForm.get(key);
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
      login: 'Login',
      email: 'Email',
      perfis: 'Perfis',
      password: 'Senha'
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
