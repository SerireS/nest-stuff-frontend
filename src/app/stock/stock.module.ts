import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ReactiveFormsModule} from '@angular/forms';
import {StockComponent} from './stock.component';
import {StockRoutingModule} from './stock-routing.module';
import { NgxsModule } from '@ngxs/store';
import {environment} from '../../environments/environment';
import {FlexModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';


@NgModule({
  declarations: [StockComponent],
    imports: [
        CommonModule,
        StockRoutingModule,
        ReactiveFormsModule,
        NgxsModule.forRoot([], {
            developmentMode: !environment.production
        }),
        FlexModule,
        MatButtonModule,
        MatFormFieldModule,
        MatCardModule
    ]
})
export class StockModule { }
