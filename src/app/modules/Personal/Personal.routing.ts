import { Routes  } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";

 export const personalRoutes : Routes =[
  {
    path:'personal/index',
    component:IndexComponent,
    loadChildren:()=>import('./Personal.module').then(m =>  m.PersonalModule)
  }

];
