import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Usuario } from '../usuarios/usuario.model';
import { UsuarioService } from '../usuarios/usuario.service';
import { BadgeModule, ButtonModule, CardModule, GridModule, TableModule } from '@coreui/angular';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, GridModule, TableModule, ButtonModule, BadgeModule]
})
export class UserAccessComponent implements OnInit {

  users: Usuario[] = [];

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usuarioService.getUsuarios().subscribe(users => {
      this.users = users;
    });
  }

  toggleUserStatus(user: Usuario): void {
    user.status = !user.status;
    this.usuarioService.updateUsuario(user).subscribe(() => {
      // status updated
    });
  }

  getPaymentStatus(userId: number): string {
    // Mock payment status logic
    return userId % 2 === 0 ? 'Inativo' : 'Ativo';
  }
}
