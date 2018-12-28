import { Component, OnInit, ViewChild, OnDestroy,NgZone} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { CategoriaAnalise } from '../../model/index';
import {ModalDirective} from "ngx-bootstrap";
import {WindowRef} from '../WindowRef';
import { UtilService, CategoriaAnaliseService } from '../../services/index';

declare var $: any;

@FadeInTop()
@Component({
  selector: 'sa-form-elements',
  templateUrl: './categoria-analise-cadastro.component.html',
  styles:['div.note-editable.panel-body{height: 180px;}']
})
export class CategoriaAnaliseCadastroComponent implements OnInit, OnDestroy{
    private sub: any;
    private tituloForm = 'Nova Categoria de Análise';
    private titulo = 'Nova Categoria de Análise';
    private codigo:string = '';
    private breadcrumb = [];
    private novacategoria:CategoriaAnalise;
    private tituloModal:string = '';
    private editCategoriaAnalise:any = {codigo:0, titulo:''};
    private listaSubcategorias:Object[] = [];

    @ViewChild('categoriaAnaliseModal') private categoriaAnaliseModal:ModalDirective;

    constructor(private route: ActivatedRoute,
          private router: Router,
          private util:UtilService,
          private zone:NgZone, private winRef: WindowRef,
          private categoriaAnaliseService:CategoriaAnaliseService){
            this.breadcrumb = ['Categoria de Análise', 'Nova'];
            this.novacategoria = new CategoriaAnalise();
            winRef.nativeWindow.angularComponentRef = {
              zone: this.zone,
              componentFn: (value) => this.editItemCategoriaAnalise(value),
              component: this
            };
            winRef.nativeWindow.angularComponentRef = {
              zone: this.zone,
              componentFn: (value) => this.apagaItemCategoriaAnalise(value),
              component: this
            };
            winRef.nativeWindow.angularComponentRef = {
              zone: this.zone,
              componentFn: (value) => this.adicionaSubItemCategoriaAnalise(value),
              component: this
            };
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.codigo = params['codigo'];
            console.log('Codigo categoria em edicao:', this.codigo);
            this.loadCategoriaAnalise();
        });
    }

    ngOnDestroy() {
      this.sub.unsubscribe();
    }

    private newCategoriaAnalise(form){
      if(!form.pristine){
        this.util.msgQuestion('Tem certeza que vai sair sem gravar?').then(
          ()=>{ this.router.navigateByUrl('/admin/categoria-analise'); },
          ()=>{  }
        );
      }else{
        this.router.navigateByUrl('/admin/categoria-analise');
      }
    }

    private loadCategoriaAnalise(){
        if(this.codigo){
          this.categoriaAnaliseService.get(this.codigo).subscribe(resp=>{
              this.novacategoria = Object.assign(new CategoriaAnalise(), resp);
              console.log('Registro em edicao:', this.novacategoria);
              this.tituloForm = this.novacategoria.codigo;
              this.titulo = 'Atualiza ' + this.novacategoria.codigo;
              this.breadcrumb = ['Categoria de Análise', this.novacategoria.codigo];

              // Fabrica listaSubcategorias
              this.refreshTreeview();

            }, (err)=> this.util.msgErroInfra(err));
        }
    }

    changeLstener(payload) {
      console.log('change payload', payload)
    }

    private loadItem(item, index){
      let obj = {"content": `<span>${item.descricao}
      <a class="btn btn-primary btn-xs icon white"
        onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.editItemCategoriaAnalise('${index}');})"
        href="javascript:void(0);" title="Alterar"><i class="fa fa-pencil "></i></a>
      <a class="btn btn-danger btn-xs icon white"
          onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.apagaItemCategoriaAnalise('${index}');})"
          href="javascript:void(0);" title="Apaga item"><i class="fa fa-times "></i></a>
      <a class="btn btn-primary btn-xs icon white"
        onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.adicionaSubItemCategoriaAnalise('${index}');})"
        href="javascript:void(0);" title="Incluir Subcategoria"><i class="fa fa-plus "></i></a>
      </span>`};
      obj['codigo'] = item.codigo;
      //if(item.children){
      //  obj['expanded'] = false;
      //  obj['children'] = [];
      //  item.children.forEach((itemFilho)=>{
      //    obj['children'].push(this.loadItem(itemFilho));
      //  });
      //}
      return obj;
    }

    private refreshTreeview(){
      this.listaSubcategorias = [];
      this.novacategoria.Itens.forEach((item, index)=>{
        if(!item['deleted'])
          this.listaSubcategorias.push(this.loadItem(item, index));
      });
      console.log('refreshTreeview', this.listaSubcategorias);
    }

    private adicionaItemCategoriaAnalise(valor){
      $('.form-horizontal').find("input").change();
      $('.btn-submit').prop('disabled', false);
      let valorSelecionado = $('#item').val();
      if(valorSelecionado){
        let item = {codigo:0, descricao: valorSelecionado};
        if(valor){
          //this.novacategoria.Itens[valor].push(item);
        }else{
          this.novacategoria.Itens.push(item);
        }

        this.refreshTreeview();

        console.log('Add sub==>', this.listaSubcategorias);
        $('#item').val('');
      }else{
        this.util.msgErro('Item de um categoria de análise não pode ser vazio');
      }
    }

    private onSubmit(form){
      if(this.codigo){
        console.log('Reg a atualizar', this.novacategoria);
        this.categoriaAnaliseService.update(this.novacategoria).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucessoEdicao(resp.mensagem);
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, err=>this.util.msgErroInfra(err));
      }else{
        console.log('Reg a inserir', this.novacategoria);
        this.novacategoria['codigo'] = this.novacategoria.codigo.toUpperCase();
        this.categoriaAnaliseService.create(this.novacategoria).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucesso(resp.mensagem);
            this.router.navigateByUrl('/admin/categoria-analise/'+ resp.codigo);
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, (err)=>this.util.msgErroInfra(err));
      }
    }

    private apagaItemCategoriaAnalise(i){
      $('.btn-submit').prop('disabled', false);
      this.novacategoria.Itens[i]['deleted'] = 1;
      this.refreshTreeview();
    }

    private editItemCategoriaAnalise(i){
      let obj = this.novacategoria.Itens[i];
      console.log('Edita', obj);
      this.editCategoriaAnalise = Object.assign({indice: i}, obj);
      this.tituloModal = `Atualizando ${this.editCategoriaAnalise.codigo} - ${this.editCategoriaAnalise.descricao}`;
      this.categoriaAnaliseModal.show();
    }

    private adicionaSubItemCategoriaAnalise(i){
      let obj = this.novacategoria.Itens[i];
      console.log('Adiciona item a ', obj);
      this.editCategoriaAnalise = {indice: 0, codigo:0, descricao: '', itempai: i};
      this.tituloModal = `Adicionando novo subitem a ${obj['descricao']}`;
      this.categoriaAnaliseModal.show();
    }

    private atualizaItemCategoriaAnalise(){
      $('.btn-submit').prop('disabled', false);
      if('itempai' in this.editCategoriaAnalise){
        console.log('Insere subcategoria');
      }else{
        console.log('Edita categoria item');
        this.novacategoria.Itens[this.editCategoriaAnalise.indice]= Object.assign(this.editCategoriaAnalise);
      }
      console.log('Registro de edicao 123', this.editCategoriaAnalise);
      console.log('Registro completo', this.novacategoria);
      //this.novacategoria.Itens[this.editCategoriaAnalise.indice] = Object.assign(this.editCategoriaAnalise);
      this.refreshTreeview();
      this.categoriaAnaliseModal.hide();
    }
}
