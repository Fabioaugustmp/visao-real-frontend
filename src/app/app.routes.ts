import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard'; // Import AuthGuard

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'relatorios-dashboard', // Redirect to relatorios-dashboard for authenticated users
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () => import('./layout').then(m => m.DefaultLayoutComponent),
    data: {
      title: 'Home'
    },
    canActivate: [AuthGuard], // Apply AuthGuard to protected routes
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/routes').then((m) => m.routes)
      },
      {
        path: 'theme',
        loadChildren: () => import('./views/theme/routes').then((m) => m.routes)
      },
      {
        path: 'base',
        loadChildren: () => import('./views/base/routes').then((m) => m.routes)
      },
      {
        path: 'buttons',
        loadChildren: () => import('./views/buttons/routes').then((m) => m.routes)
      },
      {
        path: 'forms',
        loadChildren: () => import('./views/forms/routes').then((m) => m.routes)
      },
      {
        path: 'icons',
        loadChildren: () => import('./views/icons/routes').then((m) => m.routes)
      },
      {
        path: 'notifications',
        loadChildren: () => import('./views/notifications/routes').then((m) => m.routes)
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/routes').then((m) => m.routes)
      },
      {
        path: 'charts',
        loadChildren: () => import('./views/charts/routes').then((m) => m.routes)
      },
      {
        path: 'pages',
        loadChildren: () => import('./views/pages/routes').then((m) => m.routes)
      },
      {
        path: 'medicos',
        loadChildren: () => import('./views/medicos/routes').then((m) => m.MEDICO_ROUTES),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'empresas',
        loadChildren: () => import('./views/empresas/routes').then((m) => m.EMPRESA_ROUTES),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'contadores',
        loadChildren: () => import('./views/contadores/routes').then((m) => m.CONTADOR_ROUTES),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'grupos',
        loadChildren: () => import('./views/grupos/routes').then((m) => m.GRUPO_ROUTES),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./views/usuarios/routes').then((m) => m.USUARIO_ROUTES),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'itens',
        loadChildren: () => import('./views/itens/routes').then((m) => m.ITEM_ROUTES),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'precos',
        loadChildren: () => import('./views/precos/routes').then((m) => m.PRECO_ROUTES),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'profile',
        loadComponent: () => import('./views/profile/profile.component').then(m => m.ProfileComponent),
        data: {
          title: 'Meu Perfil'
        }
      },
      {
        path: 'billing',
        loadChildren: () => import('./views/billing/routes').then((m) => m.BILLING_ROUTES)
      },
      {
        path: 'user-access',
        loadComponent: () => import('./views/user-access/user-access.component').then(m => m.UserAccessComponent),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'subscriptions',
        loadComponent: () => import('./views/subscriptions/subscriptions.component').then(m => m.SubscriptionsComponent),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'tickets',
        loadChildren: () => import('./views/tickets/routes').then((m) => m.TICKET_ROUTES)
      },
      {
        path: 'bandeiras',
        loadChildren: () => import('./views/bandeiras/routes').then((m) => m.routes),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'formas-pagamento',
        loadChildren: () => import('./views/formas-pagamento/routes').then((m) => m.routes),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'indicacoes',
        loadChildren: () => import('./views/indicacoes/routes').then((m) => m.routes)
      },
      {
        path: 'parcelamentos',
        loadChildren: () => import('./views/parcelamentos/routes').then((m) => m.routes)
      },
      {
        path: 'itens-ticket',
        loadChildren: () => import('./views/itens-ticket/routes').then((m) => m.routes)
      },
      {
        path: 'indicados',
        loadChildren: () => import('./views/indicados/routes').then((m) => m.routes)
      },
      {
        path: 'financeiros',
        loadChildren: () => import('./views/financeiros/routes').then((m) => m.routes)
      },
      {
        path: 'tarifarios',
        loadChildren: () => import('./views/tarifarios/routes').then((m) => m.routes),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      },
      {
        path: 'relatorios-dashboard',
        loadChildren: () => import('./views/relatorios-dashboard/routes').then((m) => m.routes),
        canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR', 'MEDICO', 'ROLE_MEDICO'] }
      },
      {
        path: 'relatorios-dashboard-2',
        loadChildren: () => import('./views/relatorios-dashboard-2/routes').then((m) => m.routes),
        // canActivate: [AuthGuard],
        data: { roles: ['ADMIN', 'ADMINISTRADOR', 'ROLE_ADMINISTRADOR'] }
      }
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
    }
  },
  { path: '**', redirectTo: 'login' } // Redirect all unknown paths to login
];
