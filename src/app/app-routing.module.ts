import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuGlobalComponent } from './modules/global/components/menu-global/menu-global.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

const routes: Routes = [
  {
    // Login accesible sin autenticación
    path: 'login/index',
    canActivate: [guestGuard],
    loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule),
  },
  {
    // Shell protegida: todo lo demás requiere token
    path: '',
    component: MenuGlobalComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./rutas.module').then(m => m.RutasModule),
  },
  {
    path: '**',
    redirectTo: 'login/index',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
