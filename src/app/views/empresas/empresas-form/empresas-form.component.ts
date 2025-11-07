import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmpresaService } from '../empresa.service';
import { Empresa } from '../empresa.model';
import { Contador } from '../../contadores/contador.model';
import { ContadorService } from '../../contadores/contador.service';
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
  contadores: Contador[] = [];

  constructor(
    private fb: FormBuilder,
    private empresaService: EmpresaService,
    private contadorService: ContadorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadContadores();
    this.checkMode();
  }

  initForm(): void {
    this.empresaForm = this.fb.group({
      cnpj: ['', Validators.required],
      razaoSocial: ['', Validators.required],
      idContratoCartao: ['', Validators.required],
      contador: [null, Validators.required]
    });
  }

  loadContadores(): void {
    this.contadorService.getContadores().subscribe(contadores => {
      this.contadores = contadores;
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.empresaId = +params['id'];
        this.empresaService.getEmpresa(this.empresaId).subscribe(empresa => {
          this.empresaForm.patchValue({
            ...empresa,
            contador: empresa.contador.id
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.empresaForm.valid) {
      const formValue = this.empresaForm.value;
      const selectedContador = this.contadores.find(c => c.id === +formValue.contador);
      const empresaData: Empresa = {
        id: this.empresaId,
        cnpj: formValue.cnpj,
        razaoSocial: formValue.razaoSocial,
        idContratoCartao: formValue.idContratoCartao,
        contador: selectedContador!
      };

      if (this.isEditMode) {
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

