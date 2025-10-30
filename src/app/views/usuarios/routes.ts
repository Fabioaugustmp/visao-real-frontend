import { Routes } from '@angular/router';
import { UsuariosListComponent } from './usuarios-list/usuarios-list.component';
import { UsuariosFormComponent } from './usuarios-form/usuarios-form.component';

export const USUARIO_ROUTES: Routes = [
  {
    path: '',
    component: UsuariosListComponent,
    data: {
      title: 'Usuários'
    }
  },
  {
    path: 'novo',
    component: UsuariosFormComponent,
    data: {
      title: 'Novo Usuário'
    }
  },
  {
    path: 'editar/:id',
    component: UsuariosFormComponent,
    data: {
      title: 'Editar Usuário'
    }
  }
];
