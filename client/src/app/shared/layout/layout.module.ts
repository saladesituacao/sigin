import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";

import {HeaderModule} from "./header/header.module";
import {FooterComponent} from "./footer/footer.component";
import {FooterSiteComponent} from "./footer/footer-site.component";
import {NavigationModule} from "./navigation/navigation.module";
import {RibbonComponent} from "./ribbon/ribbon.component";
import {ShortcutComponent} from "./shortcut/shortcut.component";
import {ToggleActiveDirective} from "../utils/toggle-active.directive";
import {LayoutSwitcherComponent} from "./layout-switcher.component";
import { MainLayoutComponent } from './app-layouts/main-layout.component';
import { EmptyLayoutComponent } from './app-layouts/empty-layout.component';
import {RouterModule} from "@angular/router";
import { AuthLayoutComponent } from './app-layouts/auth-layout.component';
import { ModalModule, TooltipModule, BsDropdownModule} from "ngx-bootstrap";
import { RouteBreadcrumbsComponent } from './ribbon/route-breadcrumbs.component';
import {UtilsModule} from "../utils/utils.module";

import { MarkdownToHtmlModule } from 'ng2-markdown-to-html';

@NgModule({
  imports: [
    ModalModule,
    CommonModule,
    HeaderModule,
    NavigationModule,
    FormsModule,
    RouterModule,
    UtilsModule,
    TooltipModule,
    BsDropdownModule,
    MarkdownToHtmlModule.forRoot(),
  ],
  declarations: [
    FooterComponent,
    FooterSiteComponent,
    RibbonComponent,
    ShortcutComponent,
    LayoutSwitcherComponent,
    MainLayoutComponent,
    EmptyLayoutComponent,
    AuthLayoutComponent,
    RouteBreadcrumbsComponent,
  ],
  exports:[
    HeaderModule,
    NavigationModule,
    FooterComponent,
    FooterSiteComponent,
    RibbonComponent,
    ShortcutComponent,
    LayoutSwitcherComponent,
  ]
})
export class SmartadminLayoutModule{

}
