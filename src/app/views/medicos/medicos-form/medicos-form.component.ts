import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MedicoService } from '../medico.service';
import { Medico } from '../medico.model';
import { Empresa } from '../../empresas/empresa.model';
import { Usuario } from '../../usuarios/usuario.model';
import { EmpresaService } from '../../empresas/empresa.service';
import { UsuarioService } from '../../usuarios/usuario.service';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-medicos-form',
  templateUrl: './medicos-form.component.html',
  styleUrls: ['./medicos-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule]
})
export class MedicosFormComponent implements OnInit {

  medicoForm!: FormGroup;
  isEditMode = false;
  medicoId!: number;
  empresas: Empresa[] = [];
  usuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private medicoService: MedicoService,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadEmpresas();
    this.loadUsuarios();
    this.checkMode();
  }

  initForm(): void {
    this.medicoForm = this.fb.group({
      crm: ['', Validators.required],
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      data_nasc: ['', Validators.required],
      cpf: ['', Validators.required],
      taxa_imposto: ['', Validators.required],
      id_empresa: ['', Validators.required],
      id_usuario: ['', Validators.required]
    });
  }

  loadEmpresas(): void {
    this.empresaService.getEmpresas().subscribe(empresas => {
      this.empresas = empresas;
    });
  }

  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.medicoId = +params['id'];
        this.medicoService.getMedico(this.medicoId).subscribe(medico => {
          this.medicoForm.patchValue(medico);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.medicoForm.valid) {
      const medicoData: Medico = this.medicoForm.value;
      if (this.isEditMode) {
        medicoData.id = this.medicoId;
        this.medicoService.updateMedico(medicoData).subscribe(() => {
          this.router.navigate(['/medicos']);
        });
      } else {
        this.medicoService.createMedico(medicoData).subscribe(() => {
          this.router.navigate(['/medicos']);
        });
      }
    }
  }
}
