import { Routes  } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";

export const loginRoutes : Routes =[
  {
    path: 'login/index',
    component:IndexComponent,
    loadChildren: () => import('./login.module').then(m => m.LoginModule),
  }

];
