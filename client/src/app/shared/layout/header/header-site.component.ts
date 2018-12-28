import {Component, OnInit} from '@angular/core';
import {config} from '../../smartadmin.config';
import { ParametroService } from '../../../services/index';

declare var $: any;

@Component({
  selector: 'sa-header-site',
  templateUrl: './header-site.component.html',
})
export class HeaderSiteComponent implements OnInit {

  private title: string;
  private orgao: string;
  private login: string;
  constructor(private parametroService:ParametroService) {
  }

  ngOnInit() {
      this.title = config.title;
      this.parametroService.change.subscribe(parametros=>{
          this.orgao = parametros.company;
      });
  }

}
