import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { REST } from './REST';
import { environment } from '../../environments/environment';

@Injectable()
export class PerfilService extends REST {
  constructor(http:Http) {
    super(http);
  }
  getAll(){
    return this.get(`/perfil?aplicacao=${environment.aplicacao}`);
  }
}
