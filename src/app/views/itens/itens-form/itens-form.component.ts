import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ItemService } from '../item.service';
import { Item } from '../item.model';
import { ButtonModule, CardModule, FormModule, GridModule, AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-itens-form',
  templateUrl: './itens-form.component.html',
  styleUrls: ['./itens-form.component.scss'],
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
export class ItensFormComponent implements OnInit {

  itemForm!: FormGroup;
  isEditMode = false;
  itemId!: number;

  constructor(
    private fb: FormBuilder,
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkMode();
  }

  initForm(): void {
    this.itemForm = this.fb.group({
      tipo: ['', Validators.required],
      descricao: ['', Validators.required],
      valor: [0, Validators.required]
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.itemId = +params['id'];
        this.itemService.getItem(this.itemId).subscribe(item => {
          this.itemForm.patchValue(item);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.itemForm.valid) {
      const itemData: Item = this.itemForm.value;
      if (this.isEditMode) {
        itemData.id = this.itemId;
      }

      const handleErrors = catchError((error: HttpErrorResponse) => {
        if (error.status === 400 && error.error && typeof error.error === 'object') {
          for (const key in error.error) {
            if (this.itemForm.controls[key]) {
              this.itemForm.controls[key].setErrors({ backend: error.error[key] });
            }
          }
        }
        return throwError(() => error);
      });

      if (this.isEditMode) {
        this.itemService.updateItem(itemData).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/itens']);
        });
      } else {
        this.itemService.createItem(itemData).pipe(handleErrors).subscribe(() => {
          this.router.navigate(['/itens']);
        });
      }
    } else {
      this.itemForm.markAllAsTouched();
    }
  }

  getFormErrors(): string[] {
    const errors: string[] = [];
    if (this.itemForm.invalid && (this.itemForm.dirty || this.itemForm.touched)) {
      Object.keys(this.itemForm.controls).forEach(key => {
        const control = this.itemForm.get(key);
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
      tipo: 'Tipo',
      descricao: 'Descrição',
      valor: 'Valor'
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
