import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NotificationService} from "../../shared/utils/notification.service";
import {IndicadorService, UsuarioService, UtilService, ParametroService} from '../../services/index';
import {User} from '../../model/index';

@Component({
  selector: 'app-home',
  templateUrl: './painel.component.html'
})
export class PainelComponent implements OnInit {

  private totalIndicadores:number=0;
  private listaIndicadores:any[]=[];
  private listaUsers:User[] = [];

  constructor(private route: ActivatedRoute, private notificationService: NotificationService,
      private indicadorService:IndicadorService, private usuarioService:UsuarioService,
    private util: UtilService, private parametroService:ParametroService) { }

  ngOnInit() {
    //console.log('Teste', this.route.snapshot.queryParams);
    if(this.route.snapshot.queryParams['q']==='login'){
      this.notificationService.smallBox({
        title: "Sucesso",
        content: "Login efetuado!",
        color: "#739E73",
        iconSmall: "fa fa-thumbs-up bounce animated",
        timeout: 4000
      });
      this.loadIndicadorPorUnidade();
    }
    this.loadSolicitacoesPendentes();
    this.parametroService.load();
  }

  aprovaSolicitacao(codigo:number){
    this.usuarioService.aprovaSolicitacaoPerfil(codigo).subscribe(resp=>{
      this.util.msgSucessoEdicao(resp.mensagem);
      this.loadSolicitacoesPendentes();
    }, err=>this.util.msgErroInfra(err));
  }

  rejeitaSolicitacao(codigo:number){
    this.usuarioService.rejeitaSolicitacaoPerfil(codigo).subscribe(resp=>{
      this.util.msgSucessoEdicao(resp.mensagem);
      this.loadSolicitacoesPendentes();
    }, err=>this.util.msgErroInfra(err));
  }

  loadSolicitacoesPendentes(){
    this.usuarioService.getPorSituacao(0).subscribe(resp=>{
      console.log('Usuarios:', resp);
      this.listaUsers = resp.users;
    });
  }

  loadIndicadorPorUnidade(){
    this.totalIndicadores=0;
    this.listaIndicadores=[];
    this.indicadorService.getCountPorUnidade().subscribe(resp=>{
      console.log('Unidades',resp.unidades);
      resp.unidades.forEach(item=>{
          let obj={};
          obj['label'] = item.sigla;
          obj['value'] = item.numero_indicadores;
          this.totalIndicadores = this.totalIndicadores + (+obj['value']);
          this.listaIndicadores.push(obj);
      });
    });
  }

}
