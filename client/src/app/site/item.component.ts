import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IndicadorService, UtilService } from '../services/index';

@Component({
  templateUrl: 'item.component.html',
})
export class ItemComponent implements OnInit {
  private indicador:Object=null;
  private msg_padrao = 'Não há dados cadastrados';

  constructor(private location:Location, private route: ActivatedRoute, private indicadorService:IndicadorService) {
    this.indicador = {titulo:'', descricao:'', ClassificacaoIndicador:{descricao:''},
      PeriodicidadeAtualizacao:{descricao:''},PeriodicidadeMonitoramento:{descricao:''},
      PeriodicidadeAvaliacao:{descricao:''}, Granularidade:{descricao:''}, CriterioAgregacao:{descricao:''},
      UnidadeMedida:{descricao:''}}
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
        if(params['codigo']){
          this.loadIndicador(params['codigo']);
        }
    });
  }

  loadIndicador(codigo:string){
    this.indicadorService.get(codigo).subscribe(resp=>{
      if (resp){
        console.log('Indicador:',resp);
        this.indicador = resp;
      }
    });
  }

}
