import { Routes  } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";

 export const historialRoutes : Routes =[
  {
    path:'historial/index',
    component:IndexComponent,
    loadChildren:()=>import('./historial.module').then(m =>  m.HistorialModule)
  }

];
