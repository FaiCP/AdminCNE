import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { GlobalModule } from '../global/global.module';
import { ResgistroComponent } from './components/resgistro/resgistro.component';



@NgModule({
  declarations: [
    IndexComponent,
    ResgistroComponent,
  ],
  imports: [
    CommonModule,
    GlobalModule
  ]
})
export class LoginModule { }
