import { Routes, RouterModule } from '@angular/router';

import {ModuleWithProviders} from "@angular/core";

import {PainelComponent} from "./painel/painel.component";

import { FlotChartsComponent } from './grafico/flot-charts.component';
import { MorrisChartsComponent } from './grafico/morris-charts.component';

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

import {PerfilComponent} from './perfil/perfil.component';
import {UnidadeComponent} from './cadastros_auxiliares/unidade.component';

export const homeRoutes: Routes = [
    {
        path: '',
        component: PainelComponent,
        data: {pageTitle: 'Admin'}
    },
    {
    path: 'painel',
    component: PainelComponent,
    data: {pageTitle: 'Painel'}
    },
    {
    path: 'indicador',
    component: IndicadorCadastroComponent,
    data: {pageTitle: 'Novo indicador'}
    },
    {
    path: 'indicador/:codigo',
    component: IndicadorCadastroComponent,
    data: {pageTitle: 'Edita indicador'}
    },
    {
    path: 'indicadorlista',
    component: IndicadorListaComponent,
    data: {pageTitle: 'Lista Indicadores'}
    },
    {
    path: 'indicadorlistaunidade',
    component: IndicadorListaUnidadeComponent,
    data: {pageTitle: 'Lista Indicadores por Unidade'}
    },
    {
    path: 'programa',
    component: ProgramaComponent,
    data: {pageTitle: 'Programas - Instrumentos de Gestão'}
    },
    {
    path: 'usuario',
    component: UsuarioComponent,
    data: {pageTitle: 'Lista de usuários'}
    },
    {
    path: 'categoria-analise',
    component: CategoriaAnaliseCadastroComponent,
    data: {pageTitle: 'Nova categoria de análise'}
    },
    {
    path: 'categoria-analise/:codigo',
    component: CategoriaAnaliseCadastroComponent,
    data: {pageTitle: 'Edita categoria de análise'}
    },
    {
    path: 'lista-categoria-analise',
    component: CategoriaAnaliseComponent,
    data: {pageTitle: 'Lista de categorias de análise'}
    },
    {
    path: 'tag',
    component: TagCadastroComponent,
    data: {pageTitle: 'Novo marcador'}
    },
    {
    path: 'unidade',
    component: UnidadeComponent,
    data: {pageTitle: 'Unidades'}
    },
    {
    path: 'tag/:codigo',
    component: TagCadastroComponent,
    data: {pageTitle: 'Edita marcador'}
    },
    {
    path: 'lista-tag',
    component: TagComponent,
    data: {pageTitle: 'Lista marcadores'}
    },
    {
    path: 'unidade-medida',
    component: UnidadeMedidaCadastroComponent,
    data: {pageTitle: 'Nova unidade de medida'}
    },
    {
    path: 'unidade-medida/:codigo',
    component: UnidadeMedidaCadastroComponent,
    data: {pageTitle: 'Edita unidade de medida'}
    },
    {
    path: 'lista-unidade-medida',
    component: UnidadeMedidaComponent,
    data: {pageTitle: 'Lista de unidades de medida'}
    },
    {
    path: 'fonte-dados/:codigo',
    component: FonteCadastroComponent,
    data: {pageTitle: 'Edita fonte de dados'}
    },
    {
    path: 'fonte-dados',
    component: FonteCadastroComponent,
    data: {pageTitle: 'Nova fonte de dados'}
    },
    {
    path: 'lista-fonte-dados',
    component: FonteComponent,
    data: {pageTitle: 'Lista fonte de dados'}
    },
    {
    path: 'perfil',
    component: PerfilComponent,
    data: {pageTitle: 'Perfil do usuário'}
    },
    {
    path: 'importa/:tipo',
    component: IndicadorImportaListaComponent,
    data: {pageTitle: 'Importação de dados'}
    },
];

export const AdminRouting:ModuleWithProviders = RouterModule.forChild(homeRoutes);
