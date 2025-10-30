import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmpresaService } from '../empresa.service';
import { Empresa } from '../empresa.model';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-empresas-form',
  templateUrl: './empresas-form.component.html',
  styleUrls: ['./empresas-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule]
})
export class EmpresasFormComponent implements OnInit {

  empresaForm!: FormGroup;
  isEditMode = false;
  empresaId!: number;

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.checkMode();
  }

  initForm(): void {
    this.empresaForm = this.fb.group({
      CNPJ: ['', Validators.required],
      razao_social: ['', Validators.required],
      id_contrato_cartao: ['', Validators.required],
      id_contador: ['', Validators.required]
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.empresaId = +params['id'];
        this.empresaService.getEmpresa(this.empresaId).subscribe(empresa => {
          this.empresaForm.patchValue(empresa);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.empresaForm.valid) {
      const empresaData: Empresa = this.empresaForm.value;
      if (this.isEditMode) {
        empresaData.id = this.empresaId;
        this.empresaService.updateEmpresa(empresaData).subscribe(() => {
          this.router.navigate(['/empresas']);
        });
      } else {
        this.empresaService.createEmpresa(empresaData).subscribe(() => {
          this.router.navigate(['/empresas']);
        });
      }
    }
  }
}
