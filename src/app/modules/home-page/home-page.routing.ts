import { Routes  } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";

export const homePagesRoutes : Routes =[
  {
    path:'',
    component:IndexComponent,
    loadChildren:()=>import('./home-page.module').then(m =>  m.HomePageModule)
  }

];
