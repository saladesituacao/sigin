import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { REST } from './REST';

@Injectable()
export class FonteParametroService extends REST {
  constructor(http:Http) {
    super(http);
  }
  getAll(){
    return this.get('/fonte-parametro');
  }
  getItem(codigo:number){
    return super.get(`/fonte-parametro/${codigo}`);
  }
  apaga(codigo:number){
    return super.delete(`/fonte-parametro/${codigo}`);
  }
  create(fonte:any){
    console.log('Gravando...', fonte);
    return super.post('/fonte-parametro', fonte);
  }
  update(fonte:any){
    console.log('Atualizando...', fonte);
    return super.put(`/fonte-parametro/${fonte.codigo}`, fonte);
  }
}
