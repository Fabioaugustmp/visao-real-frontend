import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ContadorService } from '../contador.service';
import { Contador } from '../contador.model';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { EmpresaService } from '../../empresas/empresa.service'; // Import EmpresaService
import { Empresa } from '../../empresas/empresa.model'; // Import Empresa model

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
  ufs: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];
  empresas: Empresa[] = []; // Property to store companies

  constructor(
    private fb: FormBuilder,
    private contadorService: ContadorService,
    private empresaService: EmpresaService, // Inject EmpresaService
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadEmpresas(); // Load companies
    this.checkMode();
  }

  get f(): { [key: string]: AbstractControl } { return this.contadorForm.controls; }

  initForm(): void {
    this.contadorForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      crc: ['', [Validators.required, Validators.maxLength(11), Validators.pattern(/^[a-zA-Z0-9]*$/)]],
      crcUf: ['', Validators.required],
      // empresaId: ['', Validators.required] // Add empresaId form control
    });
  }

  loadEmpresas(): void {
    this.empresaService.getEmpresas().subscribe(empresas => {
      this.empresas = empresas;
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.contadorId = +params['id'];
        this.contadorService.getContador(this.contadorId).subscribe(contador => {
          this.contadorForm.patchValue(contador);
          // Patch empresaId if contador has an associated company
          if (contador.empresa && contador.empresa.id) {
            this.contadorForm.patchValue({ empresaId: contador.empresa.id });
          }
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
