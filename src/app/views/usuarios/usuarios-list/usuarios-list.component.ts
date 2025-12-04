import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../usuario.model';
import { UsuarioService } from '../usuario.service';
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
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss'],
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
export class UsuariosListComponent implements OnInit {

  usuarios: Usuario[] = [];
  filteredUsuarios: Usuario[] = [];
  paginatedUsuarios: Usuario[] = [];
  isLoading: boolean = false;

  // Pagination
  currentPage: number = 0;
  pageSize: number = 10;
  totalPages: number = 0;

  // Filters
  searchNome: string = '';
  searchLogin: string = '';
  searchEmail: string = '';

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.isLoading = true;
    this.usuarioService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.usuarios = usuarios;
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
    this.filteredUsuarios = this.usuarios.filter(usuario => {
      const matchNome = !this.searchNome || (usuario.nome && usuario.nome.toLowerCase().includes(this.searchNome.toLowerCase()));
      const matchLogin = !this.searchLogin || (usuario.login && usuario.login.toLowerCase().includes(this.searchLogin.toLowerCase()));
      const matchEmail = !this.searchEmail || (usuario.email && usuario.email.toLowerCase().includes(this.searchEmail.toLowerCase()));
      return matchNome && matchLogin && matchEmail;
    });

    this.totalPages = Math.ceil(this.filteredUsuarios.length / this.pageSize);
    this.currentPage = 0;
    this.updatePaginatedData();
  }

  updatePaginatedData(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedUsuarios = this.filteredUsuarios.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  clearSearch(): void {
    this.searchNome = '';
    this.searchLogin = '';
    this.searchEmail = '';
    this.applyFilters();
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
