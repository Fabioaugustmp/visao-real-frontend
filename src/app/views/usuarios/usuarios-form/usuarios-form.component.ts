import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../usuario.service';
import { Usuario } from '../usuario.model';
import { Grupo } from '../../grupos/grupo.model';
import { GrupoService } from '../../grupos/grupo.service';
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
  grupos: Grupo[] = [];

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private grupoService: GrupoService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadGrupos();
    this.checkMode();
  }

  initForm(): void {
    this.usuarioForm = this.fb.group({
      nome: ['', Validators.required],
      login: ['', Validators.required],
      id_grupo: ['', Validators.required],
      password: ['', Validators.required],
      status: [true]
    });
  }

  loadGrupos(): void {
    this.grupoService.getGrupos().subscribe(grupos => {
      this.grupos = grupos;
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
          this.usuarioForm.patchValue(usuario);
        });
      }
    });
  }

  onSubmit(): void {
    if (this.usuarioForm.valid) {
      const usuarioData: Usuario = this.usuarioForm.value;
      if (this.isEditMode) {
        usuarioData.id = this.usuarioId;
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
