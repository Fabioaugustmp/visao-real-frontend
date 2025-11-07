import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    title: true,
    name: 'Visão Real'
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Operacional'
  },
  {
    name: 'Lançamentos',
    url: '/lancamentos',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Tickets',
        url: '/tickets',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Indicações',
        url: '/indicacoes',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Parcelamentos',
        url: '/parcelamentos',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Itens do Ticket',
        url: '/itens-ticket',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Indicados',
        url: '/indicados',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Financeiros',
        url: '/financeiros',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Administrativo'
  },
  {
    name: 'Cadastros',
    url: '/cadastros',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Médicos',
        url: '/medicos',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Empresas',
        url: '/empresas',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Contadores',
        url: '/contadores',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Grupos',
        url: '/grupos',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Usuários',
        url: '/usuarios',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Itens',
        url: '/itens',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Preços',
        url: '/precos',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Bandeiras',
        url: '/bandeiras',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Formas de Pagamento',
        url: '/formas-pagamento',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Controle de Acesso',
        url: '/user-access',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Assinaturas',
        url: '/subscriptions',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tarifários',
        url: '/tarifarios',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    divider: true,
    class: 'mt-auto'
  },
  {
    name: 'Docs',
    url: 'https://coreui.io/angular/docs/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];
