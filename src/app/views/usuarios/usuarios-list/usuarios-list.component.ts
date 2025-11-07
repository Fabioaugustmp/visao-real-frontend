import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Usuario } from '../usuario.model';
import { UsuarioService } from '../usuario.service';
import { BadgeModule, ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, GridModule, TableModule, ButtonModule, BadgeModule]
})
export class UsuariosListComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
    });
  }

  getPerfis(usuario: Usuario): string {
    return usuario.perfis.map(p => p.nome).join(', ');
  }

  deleteUsuario(id: number): void {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.deleteUsuario(id).subscribe(() => {
        this.loadUsuarios();
      });
    }
  }
}
