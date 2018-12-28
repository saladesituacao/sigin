import { Component, OnInit, OnDestroy } from '@angular/core';
import {config} from '../../smartadmin.config';
import { ParametroService } from '../../../services/index';

@Component({
  selector: 'sa-footer-site',
  templateUrl: './footer-site.component.html'
})
export class FooterSiteComponent implements OnInit, OnDestroy {
  private versionClient:string;
  private versionServer:string;
  private enviroment:string;
  private title: string;
  private titleServer: string;

  constructor(private parametroService:ParametroService) {}

  ngOnInit() {
    this.versionClient = config.version;
    this.title = config.title;
    this.parametroService.change.subscribe(parametros=>{
        this.versionServer = parametros.version;
        this.titleServer = parametros.title;
        this.enviroment = parametros.enviroment;
    });
  }

  ngOnDestroy(){
    //this.parametroService.change.unsubscribe();
  }
}
