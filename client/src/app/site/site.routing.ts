import {ModuleWithProviders} from "@angular/core"
import {RouterModule, Routes} from "@angular/router";
import { SiteComponent } from './site.component';
import { ItemComponent } from './item.component';

export const routes:Routes = [
  {
      path: '',
      component: SiteComponent,
      data: {pageTitle: 'Site'}
  }, { path: 'item/:codigo', component: ItemComponent}
];

export const routing = RouterModule.forChild(routes);
