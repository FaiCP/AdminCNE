import { Component, inject } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  standalone: false
})
export class IndexComponent {
  protected authService = inject(AuthService);

  // isAuthenticated se lee del signal directamente en el template
  get isAuthenticated(): boolean {
    return this.authService.isAuthenticatedSignal();
  }

  item = [
    { link: '/inventario/index', icon: 'inventory_2', label: 'Inventario',  color: 'primary' },
    { link: '/prestamos/index',  icon: 'swap_horiz',  label: 'Préstamos',   color: 'success' },
    { link: '/suministros/index',icon: 'category',    label: 'Suministros', color: 'warning' },
    { link: '/personal/index',   icon: 'people',      label: 'Personal',    color: 'accent'  },
    { link: '/historial/index',  icon: 'history',     label: 'Historial',   color: 'info'    },
    { link: '/custodio/index',   icon: 'badge',       label: 'Custodios',   color: 'primary' },
    { link: '/reportes/index',   icon: 'assessment',  label: 'Reportes',    color: 'error'   },
  ];
}
