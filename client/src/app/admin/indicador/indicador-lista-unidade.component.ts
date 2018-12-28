import {Component, OnInit, ViewChild, NgZone} from '@angular/core';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {ModalDirective} from "ngx-bootstrap";
import {WindowRef} from '../WindowRef';

import { UnidadeService, UtilService } from '../../services/index';

class Unidade {
  codigo:number;
  sigla:string;
  nome:string;
  email:string;
  telefone:string;
  competencia:string;
  atividade:string;
  isInformal:boolean;
  unidade_pai:number;
  constructor(){
    this.isInformal = false;
    this.codigo=null;
  }
}

@FadeInTop()
@Component({
  selector: 'app-projects',
  templateUrl: './indicador-lista-unidade.component.html',
})
export class IndicadorListaUnidadeComponent implements OnInit {
  private titulo:string;
  private unidade:Unidade;

  private listaUnidades:Array<Object>=[];
  private estilos=['font-sm bg-color-blue txt-color-white','bg-color-green txt-color-white', 'bg-color-magenta txt-color-white'];
  private icones=[`<i class="fa fa-institution fa-lg"></i>`,`<i class="fa  fa-building fa-lg"></i>`,`<i class="fa fa-deviantart fa-lg"></i>`];

  @ViewChild('unidadeModal') private unidadeModal:ModalDirective;

  public newUnidade(codigo_pai:number):void {
    if(codigo_pai){
      this.unidadeService.getUnidade(codigo_pai).subscribe(resp=>{
        console.log(resp);
        if(resp.unidade){
          this.titulo = `Nova unidade subordinada a ${resp.unidade.sigla}`
        }
        this.unidade = new Unidade();
        this.unidade.unidade_pai = resp.unidade.codigo;
        this.unidadeModal.show();
      });
    }else{
      this.titulo = "Nova Secretaria";
      this.unidade = new Unidade();
      this.unidade.unidade_pai = null;
      this.unidadeModal.show();
    }
  }

  public editUnidade(codigo:number):void {
    this.unidadeService.getUnidade(codigo).subscribe(resp=>{
      console.log(resp);
      if(resp.unidade){
        this.titulo = `Atualiza Unidade ${resp.unidade.sigla}`;
        this.unidade = resp.unidade;
      }

      this.unidadeModal.show();
    });
  }

  public deleteUnidade(codigo:number):void {
    this.unidadeService.apaga(codigo).subscribe(resp=>{
      if(resp.codret==0){
        this.util.msgSucessoDelete(resp.mensagem);
        this.loadItensUnidade();
      }else{
        this.util.msgErro(resp.mensagem);
      }
    }, err=>this.util.msgErroInfra(err));
  }

  public saveUnidade(form):void {
    if(form.valid){
      console.log('Formulario valido', this.unidade);
      this.unidade.sigla = this.unidade.sigla.toUpperCase();
      if(this.unidade.codigo){
        this.unidadeService.update(this.unidade).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucessoEdicao(resp.mensagem);
            this.loadItensUnidade(); //TODO: Melhorar tratamento
            this.unidadeModal.hide();
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, err=>this.util.msgErroInfra(err));
      }else{
        this.unidadeService.create(this.unidade).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucesso(resp.mensagem);
            this.loadItensUnidade();  //TODO: Melhorar tratamento
            this.unidadeModal.hide();
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, err=>this.util.msgErroInfra(err));
      }
      console.log(this.unidade);
    }else{
      console.log('Formulario invalido');
    }


  }

  constructor(private unidadeService:UnidadeService, private util:UtilService,
    private zone:NgZone, private winRef: WindowRef){
    winRef.nativeWindow.angularComponentRef = {
      zone: this.zone,
      componentFn: (value) => this.newUnidade(value),
      component: this
    };
    winRef.nativeWindow.angularComponentRef = {
      zone: this.zone,
      componentFn: (value) => this.editUnidade(value),
      component: this
    };
    winRef.nativeWindow.angularComponentRef = {
      zone: this.zone,
      componentFn: (value) => this.deleteUnidade(value),
      component: this
    };

    this.unidade = new Unidade();
  }

  changeLstener(payload) {
    console.log('change payload', payload)
  }

  ngOnInit() {
    this.loadItensUnidade();
  }

  loadItensUnidade(){
    this.unidadeService.getUnidadesHierarchical().subscribe(resp=>{
      if(resp.unidades){
        console.log('Unidades', resp.unidades);
        this.listaUnidades = [];
        resp.unidades.forEach((item)=>{
          this.listaUnidades.push(this.loadItem(item));
        });
      }
    }, err=>{ this.util.msgErroInfra(JSON.parse(err._body).message)}
    );
  }

  loadItem(item){
    let obj = {"content": `<span class=\" ${this.estilos[item.nu_nivel-1]}\" style=\"line-height: 10px\">
      <span style="vertical-align: middle"> ${this.icones[item.nu_nivel-1]} ${item.sigla} - ${item.nome}</span>
      <span style="vertical-align: middle">` +
      (item.children? "":`<button class='btn btn-xs btn-danger pull-right' style='margin-left:5px'
        onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.deleteUnidade('${item.codigo}');})">
        <i class="fa fa-times "></i>&nbsp;Apaga</button>`)
      + `<button class='btn btn-xs btn-info pull-right'
        onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.editUnidade('${item.codigo}');})">
        <i class="fa fa-pencil "></i>&nbsp;Edita
      </button>
      <button class='btn btn-xs btn-warning pull-right' style='margin-left:5px'
        onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.newUnidade('${item.codigo}');})">
        <i class="fa fa-plus"></i>&nbsp;Inclui
      </button>
      </span>
    </span>`};
    if(item.children){
      obj['expanded'] = false;
      obj['children'] = [];
      item.children.forEach((itemFilho)=>{
        obj['children'].push(this.loadItem(itemFilho));
      });
    }
    return obj;
  }
}
