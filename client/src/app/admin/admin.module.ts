import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRouting } from './admin.routing';

import {SmartadminModule} from "../shared/smartadmin.module";
import {SmartadminDatatableModule} from "../shared/ui/datatable/smartadmin-datatable.module";
import {SmartadminLayoutModule} from "../shared/layout/layout.module";
import {StatsModule} from "../shared/stats/stats.module";
import {SmartadminWidgetsModule} from "../shared/widgets/smartadmin-widgets.module";
import {FlotChartModule} from "../shared/graphs/flot-chart/flot-chart.module";
import {SmartadminEditorsModule} from "../shared/forms/editors/smartadmin-editors.module";
import { FlotChartsComponent } from './grafico/flot-charts.component';
import { MorrisChartsComponent } from './grafico/morris-charts.component';
import {MorrisGraphModule} from "../shared/graphs/morris-graph/morris-graph.module";
import {AccordionModule, CarouselModule} from "ngx-bootstrap";
import {SmartadminValidationModule} from "../shared/forms/validation/smartadmin-validation.module";
import {TreeViewModule} from "../shared/ui/tree-view/tree-view.module";

import {PainelComponent} from "./painel/painel.component";

// Itens de indicadores
import {IndicadorListaComponent} from './indicador/indicador-lista.component';
import {IndicadorCadastroComponent} from "./indicador/indicador-cadastro.component";
import {IndicadorListaUnidadeComponent} from './indicador/indicador-lista-unidade.component';
import {IndicadorImportaListaComponent} from './indicador/indicador-importa-lista.component';

// Itens de planos
import {ProgramaComponent} from './programa/programa.component';

// Itens auxiliares
import {UsuarioComponent} from './cadastros_auxiliares/usuario.component';
import {CategoriaAnaliseCadastroComponent} from './cadastros_auxiliares/categoria-analise-cadastro.component';
import {CategoriaAnaliseComponent} from './cadastros_auxiliares/categoria-analise.component';
import {TagCadastroComponent} from './cadastros_auxiliares/tag-cadastro.component';
import {TagComponent} from './cadastros_auxiliares/tag.component';
import {UnidadeMedidaCadastroComponent} from './cadastros_auxiliares/unidade-medida-cadastro.component';
import {UnidadeMedidaComponent} from './cadastros_auxiliares/unidade-medida.component';
import {FonteCadastroComponent} from './cadastros_auxiliares/fonte-cadastro.component';
import {FonteComponent} from './cadastros_auxiliares/fonte.component';
import {BancoDadosComponent} from './cadastros_auxiliares/banco-dados.component';
import {BancoDadosCadastroComponent} from './cadastros_auxiliares/banco-dados-cadastro.component';


// PerfilComponent
import {PerfilComponent} from './perfil/perfil.component';

// UnidadeComponent
import {UnidadeComponent} from './cadastros_auxiliares/unidade.component';

import {WindowRef} from './WindowRef';
import { ComponentesModule } from '../componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    AdminRouting,
    SmartadminModule,
    ComponentesModule,
    SmartadminValidationModule,
    SmartadminLayoutModule,
    StatsModule,
    SmartadminDatatableModule,
    SmartadminWidgetsModule,
    MorrisGraphModule,
    FlotChartModule,
    SmartadminEditorsModule,
    AccordionModule.forRoot(),
    CarouselModule.forRoot(),
    TreeViewModule
  ],
  declarations: [PainelComponent,
    FlotChartsComponent,
    MorrisChartsComponent,
    IndicadorListaComponent,
    IndicadorCadastroComponent,
    IndicadorListaUnidadeComponent,
    IndicadorImportaListaComponent,
    CategoriaAnaliseCadastroComponent,
    CategoriaAnaliseComponent,
    UsuarioComponent,
    ProgramaComponent,
    TagCadastroComponent,
    TagComponent,
    UnidadeMedidaCadastroComponent,
    UnidadeMedidaComponent,
    UnidadeComponent,
    PerfilComponent,
    FonteCadastroComponent,
    FonteComponent
  ],
  providers:[WindowRef]
})

export class AdminModule { }
