import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalModule } from './modules/global/global.module';
import { HomePageModule } from './modules/home-page/home-page.module';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        GlobalModule,
        FormsModule,
        HomePageModule,
        CarouselModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
