import { Component, OnInit, ViewContainerRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import {ModalDirective} from "ngx-bootstrap";

import { AuthenticationService, UtilService, PerfilService, UnidadeService,UsuarioService, ParametroService } from '../services/index';
import { User, UnidadeResponsavel } from '../model/index';
import { NotificationService } from "../shared/utils/notification.service";
import { environment } from '../../environments/environment';
import {config} from '../shared/smartadmin.config';
declare var $: any;

@Component({
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  f:any;
  model: any = {};
  env: any = environment;
  private newuser: User;
  private title: string;
  private orgao: string;
  private tipo_login: string;
  private colecaoPerfis:any[] = [];
  @ViewChild('complementoModal') private complementoModal:ModalDirective;
  private colecaoUnidades:UnidadeResponsavel[] = [];
  private   validatorOptions = {
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      nome: {
        validators: {
          notEmpty: {
            message: 'Nome é obrigatório'
          },
          stringLength: {
                        max: 50,
                        min: 3,
                        message: 'Digite um nome válido'
                    }
        }
      },
      celular: {
        validators: {
          notEmpty: {
            message: 'Número de telefone celular é obrigatório'
          }
        }
      },
      cpf: {
        validators: {
          notEmpty: {
            message: 'CPF é obrigatório'
          }
        }
      },
      email: {
        validators: {
          notEmpty: {
            message: 'Email é obrigatório'
          },
          emailAddress: {
            message: 'Email inválido'
          }
        }
      },
      sexo: {
        validators: {
          notEmpty: {
            message: 'Informação de sexo é obrigatória'
          }
        }
      },
      unidade: {
        validators: {
          notEmpty: {
            message: 'Unidade de lotação é obrigatória'
          }
        }
      },
      perfilusr: {
        validators: {
          notEmpty: {
            message: 'Perfil é obrigatório'
          }
        }
      }
    }
  };

  constructor(private router: Router, private auth: AuthenticationService,
    private unidadeService:UnidadeService,  private usuarioService:UsuarioService, private util:UtilService,
    private perfilService:PerfilService, private parametroService:ParametroService) {
    }

  ngOnInit() {
    // TODO: Colocar essa parte no open form
    this.newuser = new User();
    this.title = config.title;

    this.parametroService.change.subscribe(parametros=>{
        this.orgao = parametros.company;
        this.tipo_login = parametros.login;
    });
    this.perfilService.getAll().subscribe(resp=>{
      this.colecaoPerfis = resp.perfis;
    }, err => this.util.msgErroInfra(err));
    this.unidadeService.getAll().subscribe(resp=>{
        this.colecaoUnidades = resp.unidades;
    }, err => this.util.msgErroInfra(err));
    this.auth.logout();
    this.parametroService.load();
  }

  isSCPA(){
    return this.tipo_login=='scpa';
  }

  login(){
    this.auth.login(this.model.usuario, this.model.senha).subscribe(resp =>{
      console.log("Sucesso no login",resp);
      this.router.navigate(['/admin'], {queryParams: {q:'login'}});
    }, err =>{
      console.log("Erro no login", err);
      let mensagem = JSON.parse(err._body);
      if ([403,500].indexOf(err.status)> -1){
        this.util.msgErro(mensagem.message);
      }else if(err.status==406){
        let entidade = JSON.parse(err._body);
        console.log('entidade', entidade);
        localStorage.setItem('token', entidade.token);
        this.newuser = Object.assign(new User(), entidade.user);
        //$('#nome').prop('disabled', 'nome' in entidade.user);
        //$('#email').prop('disabled', ('email' in entidade.user) && entidade.user.email);
        this.complementoModal.show();
        setTimeout(()=>{
          $.each($('input[saMaskedInput]'), (index,value)=>{
            $(value).mask($(value).attr('saMaskedInput'));
          })}
        , 500);
      }else{
        this.util.msgErroInfra("Erro no acesso ao login. Tente mais tarde!");
      }
    });
  }

  private onSubmit(form){
    // Campos com controle de mascara não atualiza a model do angular2.
    this.newuser.celular= $('#celular').val();
    this.newuser.cpf= $('#cpf').val();
    this.newuser.telefone= $('#telefone').val();
    this.newuser.ramal= $('#ramal').val();
    $(':input[type="submit"]').prop('disabled', false);
    this.newuser.sexo = $("input[type='radio'][name='sexo']:checked").val();
    //if(this.newuser.Perfil && this.newuser.Perfil.exige_unidade){
    //FIX: Todos os perfis vao exigir unidade de lotacao.
      this.newuser.UnidadeCodigo = JSON.parse($('#UnidadeCodigo').val());
      if(!this.newuser.UnidadeCodigo){
        this.util.msgErro("Unidade de lotação é obrigatória");
        return false;
      }
    //}
    //
    let user = Object.assign(new User(), this.newuser);
    // Limpa formatacoes
    user.celular = user.celular.replace(/[\.\(\)-\s]/g,'');
    user.cpf = user.cpf.replace(/[\.-]/g,'');
    user.telefone = user.telefone.replace(/[\.\(\)-\s]/g,'');

    this.f = form;
    if(form.valid){
      this.usuarioService.createSolicitacao(user).subscribe(resp=>{
        if(resp.codret==0){
          this.util.msgSucesso(resp.mensagem);
          this.complementoModal.hide();
        }else{
          this.util.msgErro(resp.mensagem);
        }
      }, err => this.util.msgErro(JSON.parse(err._body).message))
    }else {
      //var validator = form.validate();
      //validator.resetForm();
      console.log('Formulário inválido');
    }
    console.log('Submetido', form, this.newuser);
  }
}
