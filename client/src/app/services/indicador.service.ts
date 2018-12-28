import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { REST } from './REST';

@Injectable()
export class IndicadorService extends REST {
  constructor(http:Http) {
    super(http);
  }

  getAll(limit?:number, offset?:number, query?:string){
    if(!limit){
      limit = 9999;
    }
    if(!offset){
      offset=0;
    }
    if(!query){
      query='';
    }
    console.log('query', query);
    let path = `/indicador?limit=${limit}&offset=${offset}&${query}`;
    return super.get(path);
  }

  async getAllSync(limit?:number, offset?:number, query?:string){
    if(!limit){
      limit = 9999;
    }
    if(!offset){
      offset=0;
    }
    if(!query){
      query='';
    }
    console.log('query', query);
    let path = `/indicador?limit=${limit}&offset=${offset}&${query}`;
    return await super.get(path).toPromise();
  }

  get(codigo:string){
    return super.get(`/indicador/${codigo}`);
  }

  async getSync(codigo:string){
    return await super.get(`/indicador/${codigo}`).toPromise();
  }

  create(indicador:any){
    return super.post('/indicador', indicador);
  }

  update(indicador:any){
    return super.put(`/indicador/${indicador.codigo}`, indicador);
  }

  delete(codigo:string){
    return super.delete(`/indicador/${codigo}`);
  }

  updateConceituacao(codigo:string, conceituacao:string){
    return super.patch(`/indicador/${codigo}/conceituacao`,{conceituacao: conceituacao});
  }

  updateInterpretacao(codigo:string, interpretacao:string){
    return super.patch(`/indicador/${codigo}/interpretacao`,{interpretacao: interpretacao});
  }

  updateUso(codigo:string, usos:string){
    return super.patch(`/indicador/${codigo}/uso`,{usos: usos});
  }

  updateLimitacao(codigo:string, limitacoes:string){
    return super.patch(`/indicador/${codigo}/limitacao`,{limitacoes: limitacoes});
  }

  updateNota(codigo:string, notas:string){
    return super.patch(`/indicador/${codigo}/nota`,{notas: notas});
  }

  updateObservacao(codigo:string, observacoes:string){
    return super.patch(`/indicador/${codigo}/observacao`,{observacoes: observacoes});
  }

  updateMetodoCalculo(codigo:string, metodo_calculo:string){
    return super.patch(`/indicador/${codigo}/metodo_calculo`,{metodo_calculo: metodo_calculo});
  }

  updateProcedimentoOperacional(codigo:string, procedimento_operacional:string){
    return super.patch(`/indicador/${codigo}/procedimento_operacional`,{procedimento_operacional: procedimento_operacional});
  }

  updateFonteDados(codigo:string, fonte_dados:string){
    return super.patch(`/indicador/${codigo}/fonte_dados`,{fonte_dados: fonte_dados});
  }

  adicionaIndicadorRelacionado(id_pai:number, id:number){
    return super.patch(`/indicador/${id_pai}/indicador-relacionado/${id}`,'');
  }

  deleteIndicadorRelacionado(id_pai:number, id:number){
    return super.delete(`/indicador/${id_pai}/indicador-relacionado/${id}`);
  }

  adicionaResponsavelGerencial(id_pai:number, id:number){
    return super.patch(`/indicador/${id_pai}/responsavel-gerencial/${id}`,'');
  }

  deleteResponsavelGerencial(id_pai:number, id:number){
    return super.delete(`/indicador/${id_pai}/responsavel-gerencial/${id}`);
  }

  adicionaResponsavelTecnico(id_pai:number, id:number){
    return super.patch(`/indicador/${id_pai}/responsavel-tecnico/${id}`,'');
  }

  deleteResponsavelTecnico(id_pai:number, id:number){
    return super.delete(`/indicador/${id_pai}/responsavel-tecnico/${id}`);
  }

  adicionaCategoriaRelacionada(id:number,categoria_analise:string, ){
    return super.patch(`/indicador/${id}/categoria-analise/${categoria_analise}`,'');
  }

  deleteCategoriaRelacionada(id:number, categoria_analise:string){
    return super.delete(`/indicador/${id}/categoria-analise/${categoria_analise}`);
  }

  getCountPorUnidade(){
    return super.get('/indicador-porunidade');
  }

  getCountPorTag(){
    return super.get('/indicador-portag');
  }

  getPorTipoConsulta(tipo:number){
    return super.get(`/indicador/importacao?tipo=${tipo}`)
  }
}
