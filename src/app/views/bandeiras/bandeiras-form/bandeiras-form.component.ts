import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BandeiraService } from '../bandeira.service';
import { Bandeira } from '../bandeira.model';
import { CommonModule } from '@angular/common';
import { ButtonDirective, CardBodyComponent, CardComponent, CardHeaderComponent, ColComponent, FormControlDirective, FormDirective, FormLabelDirective, RowComponent } from '@coreui/angular';

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
    ButtonDirective
  ]
})
export class BandeirasFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  bandeiraId: number | null = null;

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
