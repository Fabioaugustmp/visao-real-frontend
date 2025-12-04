import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GrupoService } from '../grupo.service';
import { Grupo } from '../grupo.model';
import { ButtonModule, CardModule, FormModule, GridModule, AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-grupos-form',
  templateUrl: './grupos-form.component.html',
  styleUrls: ['./grupos-form.component.scss'],
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
export class GruposFormComponent implements OnInit {

  grupoForm!: FormGroup;
  isEditMode = false;
  grupoId!: number;

  constructor(
    private fb: FormBuilder,
    private grupoService: GrupoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkMode();
  }

  initForm(): void {
    this.grupoForm = this.fb.group({
      nomeGrupo: ['', Validators.required]
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.grupoId = +params['id'];
        this.grupoService.getGrupo(this.grupoId).subscribe(grupo => {
          this.grupoForm.patchValue(grupo);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.grupoForm.valid) {
      const grupoData: Grupo = this.grupoForm.value;
      if (this.isEditMode) {
        grupoData.id = this.grupoId;
      }

      const handleErrors = catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error && typeof error.error === 'object') {
          for (const key in error.error) {
            if (this.grupoForm.controls[key]) {
              this.grupoForm.controls[key].setErrors({ backend: error.error[key] });
            }
          }
        }
        return throwError(() => error);
      });

      if (this.isEditMode) {
        this.grupoService.updateGrupo(grupoData).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/grupos']);
        });
      } else {
        this.grupoService.createGrupo(grupoData).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/grupos']);
        });
      }
    } else {
      this.grupoForm.markAllAsTouched();
    }
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    if (this.grupoForm.invalid && (this.grupoForm.dirty || this.grupoForm.touched)) {
      Object.keys(this.grupoForm.controls).forEach(key => {
        const control = this.grupoForm.get(key);
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
      nomeGrupo: 'Nome do Grupo'
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
