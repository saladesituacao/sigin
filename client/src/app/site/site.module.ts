import {NgModule, LOCALE_ID} from "@angular/core";
import { CommonModule } from '@angular/common';
import {SmartadminModule} from "../shared/smartadmin.module";

import {routing} from "./site.routing";

import { SiteComponent } from './site.component';
import { ItemComponent } from './item.component';
import {SmartadminLayoutModule} from "../shared/layout/layout.module";
import {MorrisGraphModule} from "../shared/graphs/morris-graph/morris-graph.module";
import {NgxPaginationModule} from 'ngx-pagination';

import { ComponentesModule } from '../componentes/componentes.module';

@NgModule({
  declarations: [SiteComponent, ItemComponent],
  imports: [
    routing,CommonModule, NgxPaginationModule, SmartadminModule, SmartadminLayoutModule, ComponentesModule,
    MorrisGraphModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: "pt-BR" }],
  entryComponents: []
})
export class SiteModule {}
