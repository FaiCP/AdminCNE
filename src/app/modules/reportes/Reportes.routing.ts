import { Routes  } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";

 export const reportesRoutes : Routes =[
  {
    path:'reportes/index',
    component:IndexComponent,
    loadChildren:()=>import('./reportes.module').then(m =>  m.ReportesModule)
  }

];
