import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { GlobalModule } from './modules/global/global.module';
import { HomePageModule } from './modules/home-page/home-page.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    GlobalModule,
    HomePageModule,
    CarouselModule.forRoot(), // Configuración de ngx-bootstrap
  ],
  providers: [
    // Si el problema persiste, elimina esta línea para probar
    provideHttpClient(withInterceptorsFromDi()),
    provideCharts(withDefaultRegisterables()),
  ],
  
})
export class AppModule {}
