import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { REST } from './REST';

@Injectable()
export class UnidadeMedidaService extends REST {
  constructor(http:Http) {
    super(http);
  }
  getAll(){
    return this.get('/unidade-medida');
  }
  getItem(codigo:number){
    return super.get(`/unidade-medida/${codigo}`);
  }
  apaga(codigo:number){
    return super.delete(`/unidade-medida/${codigo}`);
  }
  create(unidademedida:any){
    console.log('Gravando...', unidademedida);
    return super.post('/unidade-medida', unidademedida);
  }
  update(unidademedida:any){
    console.log('Atualizando...', unidademedida);
    return super.put(`/unidade-medida/${unidademedida.codigo}`, unidademedida);
  }
}
