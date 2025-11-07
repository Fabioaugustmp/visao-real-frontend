import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario.model';
import { Perfil } from '../perfil.model';
import { PerfilService } from '../perfil.service';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: ['./usuarios-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule]
})
export class UsuariosFormComponent implements OnInit {

  usuarioForm!: FormGroup;
  isEditMode = false;
  usuarioId!: number;
  perfis: Perfil[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private perfilService: PerfilService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadPerfis();
    this.checkMode();
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      login: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      perfis: [[], Validators.required],
      password: ['', Validators.required],
      status: [true]
    });
  }

  loadPerfis(): void {
    this.perfilService.getPerfis().subscribe(perfis => {
      this.perfis = perfis;
    });
  }

  checkMode(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.usuarioId = +params['id'];
        this.usuarioForm.get('password')?.clearValidators();
        this.usuarioForm.get('password')?.updateValueAndValidity();
        this.usuarioService.getUsuario(this.usuarioId).subscribe(usuario => {
          this.usuarioForm.patchValue({
            ...usuario,
            perfis: usuario.perfis.map(p => p.id)
          });
        });
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const formValue = this.usuarioForm.value;
      const selectedPerfis = this.perfis.filter(p => formValue.perfis.includes(p.id));
      const usuarioData: Usuario = {
        id: this.usuarioId,
        nome: formValue.nome,
        login: formValue.login,
        email: formValue.email,
        perfis: selectedPerfis,
        password: formValue.password,
        status: formValue.status,
        dataCriacao: new Date() // This should be handled by the backend
      };

      if (this.isEditMode) {
        this.usuarioService.updateUsuario(usuarioData).subscribe(() => {
          this.router.navigate(['/usuarios']);
        });
      } else {
        this.usuarioService.createUsuario(usuarioData).subscribe(() => {
          this.router.navigate(['/usuarios']);
        });
      }
    }
  }
}

