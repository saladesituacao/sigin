import { Component,OnInit, ViewChild } from '@angular/core';
import {ModalDirective} from "ngx-bootstrap";
import {UtilService} from '../../services/index';

@Component({
  templateUrl: 'perfil.component.html',
})

export class PerfilComponent implements OnInit{
  @ViewChild('perfilModal') perfilModal:ModalDirective;
  private user:Object = {};

  constructor(private util:UtilService) {
  }

  public ngOnInit(){
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    console.log('user', this.user);

    //this.perfilModal.show();
  }

  private getDate():string{
    let data = new Date();
    //return data.toLocaleDateString('pt-BR') + ' - ' + data.toLocaleTimeString('pt-BR');
    return data.toLocaleString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  }

  private editItemPerfil(){
    this.perfilModal.show();
  }

}
