import { Routes  } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";

 export const suministrosRoutes : Routes =[
  {
    path:'suministros/index',
    component:IndexComponent,
    loadChildren:()=>import('./Suministros.module').then(m =>  m.SuministrosModule)
  }

];
