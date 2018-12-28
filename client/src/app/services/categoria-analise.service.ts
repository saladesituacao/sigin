import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { REST } from './REST';

@Injectable()
export class CategoriaAnaliseService extends REST {
  constructor(http:Http) {
    super(http);
  }
  getAll(){
    return super.get('/categoria-analise');
  }
  get(codigo:string){
    return super.get(`/categoria-analise/${codigo}`);
  }
  apaga(codigo:string){
    return super.delete(`/categoria-analise/${codigo}`);
  }
  create(categoria:any){
    console.log('Gravando...', categoria);
    return super.post('/categoria-analise', categoria);
  }
  update(categoria:any){
    return super.put(`/categoria-analise/${categoria.codigo}`, categoria);
  }
}
