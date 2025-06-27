import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    standalone: false
})
export class IndexComponent implements OnInit {
  isAuthenticated = false;

  item = [
    { link: '/inventario/index', icon: 'event_available', label: 'Inventario' },
    { link: '/prestamos/index', icon: 'event_busy', label: 'Préstamos' },
    { link: '/suministros/index', icon: 'badge', label: 'Suministros' },
    { link: '/personal/index', icon: 'co_present', label: 'Personal' },
    { link: '/historial/index', icon: 'date_range', label: 'Historial' },
    { link: '/custodio/index', icon: 'supervisor_account', label: 'Custodios' },
    { link: '/reportes/index', icon: 'donut_small', label: 'Reportes' },
  ];


  constructor(public authService: AuthService) {}


  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();

    // Recalcular cuando cambie el token o el usuario
    this.authService.getUserName().subscribe(userName => {
      this.isAuthenticated = this.authService.isAuthenticated();
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
