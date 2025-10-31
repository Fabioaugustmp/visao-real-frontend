import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContadorService } from '../contador.service';
import { Contador } from '../contador.model';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-contadores-form',
  templateUrl: './contadores-form.component.html',
  styleUrls: ['./contadores-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule]
})
export class ContadoresFormComponent implements OnInit {

  contadorForm!: FormGroup;
  isEditMode = false;
  contadorId!: number;

  constructor(
    private fb: FormBuilder,
    private contadorService: ContadorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkMode();
  }

  initForm(): void {
    this.contadorForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      crc: ['', Validators.required],
      crcUf: ['', Validators.required]
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.contadorId = +params['id'];
        this.contadorService.getContador(this.contadorId).subscribe(contador => {
          this.contadorForm.patchValue(contador);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.contadorForm.valid) {
      const contadorData: Contador = this.contadorForm.value;
      if (this.isEditMode) {
        contadorData.id = this.contadorId;
        this.contadorService.updateContador(contadorData).subscribe(() => {
          this.router.navigate(['/contadores']);
        });
      } else {
        this.contadorService.createContador(contadorData).subscribe(() => {
          this.router.navigate(['/contadores']);
        });
      }
    }
  }
}
