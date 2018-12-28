import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http } from '@angular/http';
import { REST } from './REST';

@Injectable()
export class ParametroService extends REST{
  private parametro:Object = {};
  @Output() change: EventEmitter<Object> = new EventEmitter();

  constructor(http:Http) {
    super(http);
  }

  load(){
     super.get('/version').subscribe(resp=>{
       this.parametro = resp;
       this.change.emit(this.parametro);
     });
  }

}
