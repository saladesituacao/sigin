import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { BancoDados } from '../../model/index';
import { BancoDadosService, UtilService } from '../../services/index';

@FadeInTop()
@Component({
  selector: 'sa-form-elements',
  templateUrl: './banco-dados-cadastro.component.html',
  styles:['div.note-editable.panel-body{height: 180px;}']
})
export class BancoDadosCadastroComponent implements OnInit, OnDestroy{
    private sub: any;
    private tituloForm = 'Banco de Dados';
    private tituloinit = 'Novo Banco de Dados';
    private codigo:number = 0;
    private breadcrumb = [];
    private novobancoDados:BancoDados;


    constructor(private route: ActivatedRoute,
          private router: Router,
          private bancoDadosService:BancoDadosService,
          private util: UtilService){
            this.breadcrumb = ['Banco de Dados', 'Nova'];
            this.tituloinit = 'Novo Banco de Dados';
            this.novobancoDados = new BancoDados();
          }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.codigo = params['codigo'];
            console.log('Codigo do banco de dados em edicao:', this.codigo);
            this.loadBancoDados();
        });
    }

    ngOnDestroy() {
      this.sub.unsubscribe();
    }

    private newBancoDados(form){
      if(!form.pristine){
        this.util.msgQuestion('Tem certeza que vai sair sem gravar?').then(
          ()=>{ this.router.navigateByUrl('/admin/banco-dados'); },
          ()=>{  }
        );
      }else{
        this.router.navigateByUrl('/admin/banco-dados');
      }
    }

    private loadBancoDados(){
        if(this.codigo){
          this.bancoDadosService.getItem(this.codigo).subscribe(resp=>{
              this.novobancoDados = Object.assign(new BancoDados(), resp);
              console.log('Registro em edicao:', this.novobancoDados);
              this.tituloinit = `Atualiza ${this.novobancoDados.descricao}`;
              this.breadcrumb = ['Banco de Dados', this.novobancoDados.codigo];
            }, (err)=> this.util.msgErroInfra(err));
        }
    }

    private onSubmit(form){
      this.bancoDadosService = Object.assign(this.novobancoDados, form.value);
      if(form.valid){
        if(this.novobancoDados.codigo){
          this.bancoDadosService.update(this.novobancoDados).subscribe(resp=>{
            if(resp.codret==0){
              this.util.msgSucessoEdicao(resp.mensagem);
            }else{
              this.util.msgErro(resp.mensagem);
            }
          }, err=>this.util.msgErroInfra(err));
        }else{
          this.bancoDadosService.create(this.novobancoDados).subscribe(resp=>{
            if(resp.codret==0){
              this.util.msgSucesso(resp.mensagem);
              this.router.navigateByUrl('/admin/banco-dados/'+ resp.codigo);
            }else{
              this.util.msgErro(resp.mensagem);
            }
          }, (err)=>this.util.msgErroInfra(err));
        }
      }else{
        this.util.msgErro('Erro de validação de campos');
      }
    }

}
