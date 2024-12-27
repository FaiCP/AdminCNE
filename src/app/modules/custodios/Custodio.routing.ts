import { Routes  } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";

export const CustodioRoutes : Routes =[
  {
    path: 'custodio/index',
    component:IndexComponent,
    loadChildren: () => import('./custodios.module').then(m => m.CustodiosModule),
  }

];
