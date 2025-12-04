import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../usuarios/usuario.model';
import { UsuarioService } from '../usuarios/usuario.service';
import {
  BadgeModule,
  ButtonModule,
  CardModule,
  GridModule,
  TableModule,
  PaginationModule,
  FormModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';

@Component({
  selector: 'app-user-access',
  templateUrl: './user-access.component.html',
  styleUrls: ['./user-access.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    CardModule,
    GridModule,
    TableModule,
    ButtonModule,
    BadgeModule,
    PaginationModule,
    FormModule,
    IconModule
  ]
})
export class UserAccessComponent implements OnInit {

  users: Usuario[] = [];
  filteredUsers: Usuario[] = [];
  paginatedUsers: Usuario[] = [];
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Filters
  searchNome: string = '';

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (users) => {
        this.users = users;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar usuários', error);
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchNome = !this.searchNome || (user.nome && user.nome.toLowerCase().includes(this.searchNome.toLowerCase()));
      return matchNome;
    });

    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.currentPage = 0;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  clearSearch(): void {
    this.searchNome = '';
    this.applyFilters();
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
