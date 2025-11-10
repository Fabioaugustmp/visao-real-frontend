import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';

import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective,
  INavData
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { AuthService } from 'src/app/services/auth.service'; // Import AuthService

function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = [...navItems];
  public filteredNavItems: INavData[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService // Inject AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getUserRoles().subscribe(roles => {
      this.filteredNavItems = this.filterNavItems(this.navItems, roles);
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Re-filter nav items on navigation end to ensure correct display
        this.authService.getUserRoles().subscribe(roles => {
          this.filteredNavItems = this.filterNavItems(this.navItems, roles);
        });
      }
    });
  }

  private filterNavItems(items: INavData[], userRoles: string[]): INavData[] {
    return items.filter(item => {
      // If item has roles, check if user has any of them
      if (item.roles && item.roles.length > 0) {
        const hasAccess = item.roles.some(role => userRoles.includes(role));
        if (!hasAccess) {
          return false; // Hide item if user doesn't have required role
        }
      }

      // If item has children, filter them recursively
      if (item.children) {
        item.children = this.filterNavItems(item.children, userRoles);
        // Keep parent if it has accessible children or no roles defined
        return item.children.length > 0 || !item.roles || item.roles.length === 0;
      }

      return true; // Keep item if no roles defined or user has access
    });
  }
}
