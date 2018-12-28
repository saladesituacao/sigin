import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { REST } from './REST';

@Injectable()
export class BancoDadosService extends REST {
  constructor(http:Http) {
    super(http);
  }
  getAll(){
    return this.get('/banco-dados');
  }
  getItem(codigo:number){
    return super.get(`/banco-dados/${codigo}`);
  }
  apaga(codigo:number){
    return super.delete(`/banco-dados/${codigo}`);
  }
  create(banco:any){
    return super.post('/banco-dados', banco);
  }
  update(banco:any){
    return super.put(`/banco-dados/${banco.codigo}`, banco);
  }
}
