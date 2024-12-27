import { Routes  } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";

 export const prestamosRoutes : Routes =[
  {
    path:'prestamos/index',
    component:IndexComponent,
    loadChildren:()=>import('./Prestamos.module').then(m =>  m.PrestamosModule)
  }

];
