import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../global/global.module';
import { FormComponent } from './components/form/form.component';
import { IndexComponent } from './components/index/index.component';
import { FormkitsComponent } from './components/formkits/formkits.component';


@NgModule({
  declarations: [
    FormComponent,
    IndexComponent,
    FormkitsComponent
  ],
  imports: [
    CommonModule,
    GlobalModule,
  ]
})
export class InventarioModule { }
