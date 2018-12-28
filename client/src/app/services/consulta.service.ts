import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { REST } from './REST';

@Injectable()
export class ConsultaService extends REST {
  constructor(http:Http) {
    super(http);
  }

  async search(codigo:string, data:string='', tipo:string='', formato:string='LIN'){
    var search='';
    if(data){
      search += `data=${data}&`;
    }
    if(tipo){
      search += `tipo=${tipo}&`;
    }
    if(formato){
      search += `formato=${formato}&`;
    }
    console.log(`/indicador/${codigo}/resultset?${search}`);
    const response = await this.get(`/indicador/${codigo}/resultset?${search}`).toPromise();
    return response;
  }
}
