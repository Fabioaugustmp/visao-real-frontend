import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BandeiraService } from '../bandeira.service';
import { Bandeira, BandeiraEnum } from '../bandeira.model';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, FormModule, GridModule, AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-bandeiras-form',
  templateUrl: './bandeiras-form.component.html',
  styleUrls: ['./bandeiras-form.component.scss'],
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
export class BandeirasFormComponent implements OnInit {

  form!: FormGroup;
  isEditMode = false;
  bandeiraId: number | null = null;
  bandeiraEnums = Object.values(BandeiraEnum);

  constructor(
    private fb: FormBuilder,
    private bandeiraService: BandeiraService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.bandeiraId = this.route.snapshot.params['id'];
    if (this.bandeiraId) {
      this.isEditMode = true;
      this.bandeiraService.getBandeira(this.bandeiraId).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      bandeira: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const bandeira: Bandeira = this.form.value;

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
        this.bandeiraService.updateBandeira(bandeira).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/bandeiras']);
        });
      } else {
        this.bandeiraService.createBandeira(bandeira).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/bandeiras']);
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
      bandeira: 'Bandeira'
    };

    const fieldName = fieldNames[controlName] || controlName;

    switch (errorName) {
      case 'required':
        return `${fieldName} é obrigatória.`;
      case 'backend':
        return `${fieldName}: ${errorValue}`;
      default:
        return `${fieldName} é inválida.`;
    }
  }

  cancelar(): void {
    this.router.navigate(['/bandeiras']);
  }
}
