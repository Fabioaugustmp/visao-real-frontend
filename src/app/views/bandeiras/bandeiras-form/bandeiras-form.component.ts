import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BandeiraService } from '../bandeira.service';
import { Bandeira, BandeiraEnum } from '../bandeira.model';
import { CommonModule } from '@angular/common';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, FormDirective, FormLabelDirective, RowComponent, FormSelectDirective } from '@coreui/angular'; // Added FormSelectDirective
import { ValidationFeedbackComponent } from '../../../components/validation-feedback/validation-feedback.component'; // Corrected import path

@Component({
  selector: 'app-bandeiras-form',
  templateUrl: './bandeiras-form.component.html',
  styleUrls: ['./bandeiras-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    RowComponent,
    ColComponent,
    FormLabelDirective,
    FormControlDirective,
    ButtonDirective,
    ValidationFeedbackComponent,
    FormSelectDirective // Added FormSelectDirective
  ]
})
export class BandeirasFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  bandeiraId: number | null = null;
  bandeiraEnums = Object.values(BandeiraEnum); // Make enum values available to template

  constructor(
    private fb: FormBuilder,
    private bandeiraService: BandeiraService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      bandeira: ['', Validators.required]
    });
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

  onSubmit(): void {
    if (this.form.valid) {
      const bandeira: Bandeira = this.form.value;
      if (this.isEditMode) {
        this.bandeiraService.updateBandeira(bandeira).subscribe(() => {
          this.router.navigate(['/bandeiras']);
        });
      } else {
        this.bandeiraService.createBandeira(bandeira).subscribe(() => {
          this.router.navigate(['/bandeiras']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/bandeiras']);
  }
}
