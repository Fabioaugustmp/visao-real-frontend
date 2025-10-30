import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario.model';
import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, CardModule, GridModule, FormModule, ButtonModule]
})
export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  userId = 1; // Hardcoded user ID for now

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loadUserData();
  }

  initForm(): void {
    this.profileForm = this.fb.group({
      nome: ['', Validators.required],
      login: ['', Validators.required],
      password: [''], // Password is not required
      email: ['', [Validators.required, Validators.email]],
      crm: ['', Validators.required],
      data_nasc: ['', Validators.required],
      cpf: ['', Validators.required]
    });
  }

  loadUserData(): void {
    this.usuarioService.getUsuario(this.userId).subscribe(user => {
      this.profileForm.patchValue(user);
    });
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const usuarioData: Usuario = this.profileForm.value;
      usuarioData.id = this.userId;

      // Preserve existing values for fields not in the form
      this.usuarioService.getUsuario(this.userId).subscribe(existingUser => {
        usuarioData.id_grupo = existingUser.id_grupo;
        usuarioData.status = existingUser.status;
        usuarioData.data_criacao = existingUser.data_criacao;

        this.usuarioService.updateUsuario(usuarioData).subscribe(() => {
          alert('Perfil atualizado com sucesso!');
          this.router.navigate(['/dashboard']);
        });
      });
    }
  }
}
