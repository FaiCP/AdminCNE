import { Routes  } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";

export const inventarioRoutes : Routes =[
  {
    path: 'inventario/index',
    component:IndexComponent,
    loadChildren: () => import('./Inventario.module').then(m => m.InventarioModule),
  }

];
