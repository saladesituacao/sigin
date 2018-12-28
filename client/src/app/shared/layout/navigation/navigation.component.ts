import {Component, OnInit} from '@angular/core';
import {LoginInfoComponent} from "../../user/login-info/login-info.component";
import { ParametroService } from '../../../services/index';

@Component({

  selector: 'sa-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit {

  private enviroment:string = '';
  constructor(private parametroService:ParametroService) {
  }

  ngOnInit() {
    this.parametroService.change.subscribe(parametros=>{
        this.enviroment = parametros.enviroment;
    });
  }

  isProduction(){
    return this.enviroment == 'production';

  }

}
