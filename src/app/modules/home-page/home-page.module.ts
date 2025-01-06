import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';

import { ToastrModule } from 'ngx-toastr';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@NgModule({ declarations: [
        IndexComponent,
    ],
    exports: [
        ToastrModule,
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        HttpClientModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatDialogModule,
        MatSelectModule,
        MatInputModule,
        FormsModule
    ], imports: [CommonModule,
        FormsModule,
        RouterModule,
        ToastrModule.forRoot({
            closeButton: true,
            disableTimeOut: true,
            enableHtml: true,
            progressBar: true,
            onActivateTick: true,
        }),
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatDialogModule,
        MatSelectModule,
        MatInputModule], providers: [provideHttpClient(withInterceptorsFromDi())] })

export class HomePageModule { }
