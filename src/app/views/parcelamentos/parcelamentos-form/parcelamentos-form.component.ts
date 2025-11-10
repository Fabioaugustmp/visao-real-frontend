import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ParcelamentoService } from '../parcelamento.service';
import { Parcelamento } from '../parcelamento.model';
import { CommonModule } from '@angular/common';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-parcelamentos-form',
  templateUrl: './parcelamentos-form.component.html',
  styleUrls: ['./parcelamentos-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardModule,
    GridModule,
    FormModule,
    ButtonModule
  ]
})
export class ParcelamentosFormComponent implements OnInit {

  form: FormGroup;
  isEditMode = false;
  parcelamentoId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private parcelamentoService: ParcelamentoService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      id: [null],
      descricao: ['', Validators.required],
      numeroDeParcelas: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.parcelamentoId = this.route.snapshot.params['id'];
    if (this.parcelamentoId) {
      this.isEditMode = true;
      this.parcelamentoService.getParcelamento(this.parcelamentoId).subscribe(data => {
        this.form.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const parcelamento: Parcelamento = this.form.value;
      if (this.isEditMode) {
        this.parcelamentoService.updateParcelamento(parcelamento).subscribe(() => {
          this.router.navigate(['/parcelamentos']);
        });
      } else {
        this.parcelamentoService.createParcelamento(parcelamento).subscribe(() => {
          this.router.navigate(['/parcelamentos']);
        });
      }
    }
  }

  cancelar(): void {
    this.router.navigate(['/parcelamentos']);
  }
}
