import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-validation-feedback',
  template: `
    <div *ngIf="control && control.invalid && (control.dirty || control.touched)" class="invalid-feedback d-block">
      <div *ngIf="control.errors?.['required']">
        This field is required.
      </div>
      <div *ngIf="control.errors?.['minlength']">
        Min length is {{ control.errors?.['minlength'].requiredLength }} characters.
      </div>
      <div *ngIf="control.errors?.['maxlength']">
        Max length is {{ control.errors?.['maxlength'].requiredLength }} characters.
      </div>
      <div *ngIf="control.errors?.['email']">
        Invalid email format.
      </div>
      <!-- Add more validation types as needed -->
    </div>
  `,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ValidationFeedbackComponent {
  @Input() control: AbstractControl | null = null;
}
