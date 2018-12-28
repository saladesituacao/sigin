import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { FonteParametro } from '../../model/index';
import { FonteParametroService, UtilService } from '../../services/index';

@FadeInTop()
@Component({
  selector: 'sa-form-elements',
  templateUrl: './fonte-cadastro.component.html',
  styles:['div.note-editable.panel-body{height: 180px;}']
})
export class FonteCadastroComponent implements OnInit, OnDestroy{
    private sub: any;
    private tituloForm = 'Fonte de Dados';
    private tituloinit = 'Nova Fonte de Dados';
    private codigo:number = 0;
    private breadcrumb = [];
    private novafonte:FonteParametro;


    constructor(private route: ActivatedRoute,
          private router: Router,
          private fonteService:FonteParametroService,
          private util: UtilService){
            this.breadcrumb = ['Fonte de Dados', 'Nova'];
            this.tituloinit = 'Nova Fonte de Dados';
            this.novafonte = new FonteParametro();
          }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.codigo = params['codigo'];
            console.log('Codigo da fonte em edicao:', this.codigo);
            this.loadFonteDados();
        });
    }

    ngOnDestroy() {
      this.sub.unsubscribe();
    }

    private newFonteDados(form){
      if(!form.pristine){
        this.util.msgQuestion('Tem certeza que vai sair sem gravar?').then(
          ()=>{ this.router.navigateByUrl('/admin/fonte-dados'); },
          ()=>{  }
        );
      }else{
        this.router.navigateByUrl('/admin/fonte-dados');
      }
    }

    private loadFonteDados(){
        if(this.codigo){
          this.fonteService.getItem(this.codigo).subscribe(resp=>{
              this.novafonte = Object.assign(new FonteParametro(), resp);
              console.log('Registro em edicao:', this.novafonte);
              this.tituloinit = `Atualiza ${this.novafonte.descricao}`;
              this.breadcrumb = ['Fonte de Dados', this.novafonte.sigla];
            }, (err)=> this.util.msgErroInfra(err));
        }
    }

    private onSubmit(form){
      this.novafonte = Object.assign(this.novafonte, form.value);
      if(form.valid){
        if(this.novafonte.codigo){
          this.fonteService.update(this.novafonte).subscribe(resp=>{
            if(resp.codret==0){
              this.util.msgSucessoEdicao(resp.mensagem);
            }else{
              this.util.msgErro(resp.mensagem);
            }
          }, err=>this.util.msgErroInfra(err));
        }else{
          this.fonteService.create(this.novafonte).subscribe(resp=>{
            if(resp.codret==0){
              this.util.msgSucesso(resp.mensagem);
              this.router.navigateByUrl('/admin/fonte-dados/'+ resp.codigo);
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
