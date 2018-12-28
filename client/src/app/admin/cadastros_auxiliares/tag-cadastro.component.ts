import { Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { TagCategoria } from '../../model/tag-categoria';
import {ModalDirective} from "ngx-bootstrap";
import { UtilService, TagCategoriaService } from '../../services/index';

declare var $: any;

@FadeInTop()
@Component({
  selector: 'sa-form-elements',
  templateUrl: './tag-cadastro.component.html',
  styles:['div.note-editable.panel-body{height: 180px;}']
})
export class TagCadastroComponent implements OnInit, OnDestroy{
    private sub: any;
    private tituloForm = 'Grupo de Marcadores';
    private titulo = 'Novo Grupo de Marcador';
    private codigo:number = 0;
    private breadcrumb = [];
    private tituloModal:string = '';
    private novatagcategoria:TagCategoria;
    private editTagCategoria:any = {codigo:0, descricao:''};

    @ViewChild('grupoTagModal') private grupoTagModal:ModalDirective;

    constructor(private route: ActivatedRoute,
          private router: Router,
          private tagCategoriaService:TagCategoriaService,
          private util:UtilService){
            this.breadcrumb = ['Grupo de Marcador', 'Novo'];
            this.novatagcategoria = new TagCategoria();
          }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.codigo = params['codigo'];
            console.log('Codigo marcador em edicao:', this.codigo);
            this.loadCategoriaTag();
        });
    }

    ngOnDestroy() {
      this.sub.unsubscribe();
    }

    private newCategoriaTag(form){
      console.log('Form', form.pristine);
      if(!form.pristine){
        this.util.msgQuestion('Tem certeza que vai sair sem gravar?');
      }else{
        this.router.navigateByUrl('/admin/tag');
      }
    }

    private loadCategoriaTag(){
        if(this.codigo){
          this.tagCategoriaService.getItem(this.codigo).subscribe(resp=>{
              this.novatagcategoria = Object.assign(new TagCategoria(), resp);
              console.log('Registro em edicao:', this.novatagcategoria);
              this.titulo = 'Atualiza ' + this.novatagcategoria.codigo;
              this.breadcrumb = ['Grupo de Marcador', this.novatagcategoria.codigo];
            }, (err)=> this.util.msgErroInfra(err));
        }
    }

    private adicionaMarcador(){
      $('.form-horizontal').find("input").change();
      let valorSelecionado = $('#item').val();
      if(valorSelecionado){
        this.novatagcategoria.Tags.push({codigo:0, descricao: valorSelecionado});
        $('#item').val('');
      }else{
        this.util.msgErro('Marcador não pode ser vazio');
      }
    }

    private onSubmit(form){
      console.log('onSubmit123', form.value);
      this.novatagcategoria = Object.assign(this.novatagcategoria, form.value);

      if(form.valid){
        if(this.novatagcategoria.codigo){

          this.tagCategoriaService.update(this.novatagcategoria).subscribe(resp=>{
            if(resp.codret==0){
              this.util.msgSucessoEdicao(resp.mensagem);
            }else{
              this.util.msgErro(resp.mensagem);
            }
          }, err=>this.util.msgErroInfra(err));
        }else{
          this.tagCategoriaService.create(this.novatagcategoria).subscribe(resp=>{
            if(resp.codret==0){
              this.util.msgSucesso(resp.mensagem);
              this.router.navigateByUrl('/admin/tag/'+ this.novatagcategoria.codigo);
            }else{
              this.util.msgErro(resp.mensagem);
            }
          }, (err)=>this.util.msgErroInfra(err));
        }
      }else{
        console.log(form);
        this.util.msgErro('Erro de validação de campos');
      }
    }

    private apagaItemTagCategoria(i){
      $('.form-horizontal').find("input").change();
      this.novatagcategoria.Tags[i]['deleted'] = 1;
    }

    private editaItemTagCategoria(i){
      console.log('Edita', this.novatagcategoria.Tags[i]);
      this.editTagCategoria = Object.assign({}, this.novatagcategoria.Tags[i], {indice: i});
      this.tituloModal = `Atualizando ${this.editTagCategoria.codigo} - ${this.editTagCategoria.descricao}`;
      this.grupoTagModal.show();
    }

    private atualizaItemTagCategoria(){
      this.novatagcategoria.Tags[this.editTagCategoria.indice] = Object.assign({}, this.editTagCategoria);
      this.grupoTagModal.hide();
    }
}
