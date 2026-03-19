import { Component, OnInit, HostListener, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu-global',
  templateUrl: './menu-global.component.html',
  styleUrls: ['./menu-global.component.scss'],
  standalone: false
})
export class MenuGlobalComponent implements OnInit {
  // Signal expuesto directamente al template
  protected authService = inject(AuthService);
  private router = inject(Router);

  sidebarCollapsed = false;
  isMobile = false;

  // Getter para el template: lee el signal
  get userName(): string | null {
    return this.authService.userName();
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  closeMobileSidebar(): void {
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login/index']);
  }

  private checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (this.isMobile || window.innerWidth <= 1024) {
      this.sidebarCollapsed = true;
    } else {
      this.sidebarCollapsed = false;
    }
  }
}
