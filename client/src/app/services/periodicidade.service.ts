import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { REST } from './REST';

@Injectable()
export class PeriodicidadeService extends REST {
  constructor(http:Http) {
    super(http);
  }
  getAll(){
    return this.get('/periodicidade');
  }
}
