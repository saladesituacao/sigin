import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { REST } from './REST';

@Injectable()
export class UnidadeService extends REST {
  constructor(http:Http) {
    super(http);
  }
  getAll(){
    return this.get('/unidade');
  }

  getUnidade(codigo:number){
    return this.get(`/unidade/${codigo}`);
  }

  create(unidade:any){
    return super.post('/unidade', unidade);
  }

  update(unidade:any){
    return super.put(`/unidade/${unidade.codigo}`, unidade);
  }

  apaga(codigo:number){
    return super.delete(`/unidade/${codigo}`);
  }

  getUnidadesHierarchical(){
    return this.get('/unidade-hierarquia');
  }
}
