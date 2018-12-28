import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit} from '@angular/core';
import { FadeInTop } from "../../shared/animations/fade-in-top.decorator";
import { ClassificacaoIndicadorService, IndicadorService, UnidadeMedidaService,
  PeriodicidadeService, UtilService, ConsultaService,ClassificacaoMSIndicadorService,
  TagCategoriaService, CategoriaAnaliseService, BancoDadosService, TipoConsultaService,
  UnidadeService, GranularidadeService, CriterioAgregacaoService, PolaridadeService,
  Classificacao6sIndicadorService, FonteParametroService} from '../../services/index';
import { ActivatedRoute, Router } from '@angular/router';
import { Indicador } from '../../model/index';

import '../../extensions/array.extension';

declare var $: any;

@FadeInTop()
@Component({
  selector: 'sa-form-elements',
  templateUrl: './indicador-cadastro.component.html',
  styles:['div.note-editable.panel-body{height: 180px;}']
})
export class IndicadorCadastroComponent implements OnInit, OnDestroy, AfterViewInit {
  private currenttab = 't1';
  private msg_padrao = 'Não há dados cadastrados';
  private tituloForm = 'Novo Indicador';
  private titulo = 'Novo Indicador';
  private tituloCabecalho = 'Cadastro de um novo indicador';
  private breadcrumb = [];
  private sub: any;
  private flag_update:boolean = false;
  private secretaria_selecionada: Object = {};

  @ViewChild('tags') selectElRef;

  private options = {focus: true, height: 100, lang:'pt-BR',
    toolbar: [
      // [groupName, [list of button]]
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['font', ['superscript', 'subscript']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['ctrl', ['undo', 'redo']]
    ]};

  private indicador:Indicador;

  private colecaoClassificacao:any[] = [];
  private colecaoClassificacao6s:any[] = [];
  private colecaoClassificacaoMS:any[] = [];
  private colecaoPeriodicidade:any[] = [];
  private colecaoUnidadeMedida:any[] = [];
  private colecaoSecretaria:any[] = [];
  private colecaoTagCategoria:any[] = [];
  private colecaoCategoriaAnalise:any[] = [];
  private colecaoIndicadores:any[] = [];
  private colecaoTipoConsulta:any[] = [];
  private colecaoBancoDados:any[] = [];
  private colecaoUnidades:any[] = [];
  private colecaoGranularidades:any[] = [];
  private colecaoCriteriosAgregacao:any[] = [];
  private colecaoPolaridades:any[] = [];
  private colecaoFonteParametro:any[] = [];

  private isEditConceituacao:false;
  private isEditInterpretacao:false;
  private isEditUsos:false;
  private isEditLimitacoes:false;
  private isEditNotas:false;
  private isEditObservacoes:false;
  private isEditMetodoCalculo:false;
  private isEditFonteDados:false;
  private isEditProcedimentoOperacional:false;

  constructor(private classificacaoIndicadorService:ClassificacaoIndicadorService,
      private classificacao6sIndicadorService:Classificacao6sIndicadorService,
      private classificacaoMSIndicadorService:ClassificacaoMSIndicadorService,
      private indicadorService:IndicadorService,
      private periodicidadeService:PeriodicidadeService,
      private unidadeMedidaService:UnidadeMedidaService,
      private util:UtilService,
      private tagCategoriaService:TagCategoriaService,
      private categoriaAnaliseService:CategoriaAnaliseService,
      private bancoDadosService:BancoDadosService,
      private tipoConsultaService:TipoConsultaService,
      private route: ActivatedRoute,
      private router: Router,
      private unidadeService: UnidadeService,
      private granularidadeService: GranularidadeService,
      private criterioAgregacaoService: CriterioAgregacaoService,
      private consultaService: ConsultaService,
      private polaridadeService:PolaridadeService,
      private fonteParametroService: FonteParametroService) {
        this.breadcrumb = ['Indicador', 'Novo'];

      }

  ngOnInit() {
    System.import('script-loader!summernote/dist/summernote.min.js');
    this.flag_update = false;
    this.indicador = new Indicador();
    console.log('new indicador', this.indicador);
    this.classificacaoIndicadorService.getAll().subscribe(resp => {
        this.colecaoClassificacao = resp.classificacoes;
    }, err => this.util.msgErroInfra(err));
    this.classificacao6sIndicadorService.getAll().subscribe(resp => {
        this.colecaoClassificacao6s = resp.classificacoes;
    }, err => this.util.msgErroInfra(err));
    this.classificacaoMSIndicadorService.getAll().subscribe(resp => {
      this.colecaoClassificacaoMS = resp.classificacoes;
    }, err => this.util.msgErroInfra(err));
    this.periodicidadeService.getAll().subscribe(resp => {
        this.colecaoPeriodicidade = resp.periodicidades;
    }, err => this.util.msgErroInfra(err));
    this.unidadeMedidaService.getAll().subscribe(resp => {
        this.colecaoUnidadeMedida = resp.unidades;
    }, err => this.util.msgErroInfra(err));
    this.tagCategoriaService.getAll().subscribe(resp => {
        this.colecaoTagCategoria = resp.tag_categorias;
    }, err => this.util.msgErroInfra(err));
    this.categoriaAnaliseService.getAll().subscribe(resp => {
        this.colecaoCategoriaAnalise = resp.categorias_analise;
    }, err => this.util.msgErroInfra(err));
    this.fonteParametroService.getAll().subscribe(resp => {
        this.colecaoFonteParametro = resp.fontes;
    }, err => this.util.msgErroInfra(err));
    this.tipoConsultaService.getAll().subscribe(resp => {
        this.colecaoTipoConsulta = resp.tipos_consulta;
    }, err => this.util.msgErroInfra(err));
    this.bancoDadosService.getAll().subscribe(resp => {
        this.colecaoBancoDados = resp.banco_dados;
    }, err => this.util.msgErroInfra(err));
    this.indicadorService.getAll().subscribe(resp => {
        this.colecaoIndicadores = resp.rows.filter(item=>item.codigo!=this.indicador.codigo);   //TODO: modificar para aplicar um filtro de codigo
    }, err => this.util.msgErroInfra(err));
    this.unidadeService.getAll().subscribe(resp=>{
        this.colecaoUnidades = resp.unidades;
    }, err => this.util.msgErroInfra(err));
    this.granularidadeService.getAll().subscribe(resp=>{
        this.colecaoGranularidades = resp.granularidade;
    }, err => this.util.msgErroInfra(err));
    this.criterioAgregacaoService.getAll().subscribe(resp=>{
        this.colecaoCriteriosAgregacao = resp.criterio_agregacao;
    }, err => this.util.msgErroInfra(err));
    this.polaridadeService.getAll().subscribe(resp=>{
        this.colecaoPolaridades = resp.polaridades;
    }, err => this.util.msgErroInfra(err));
    this.loadIndicador();
  }

  ngAfterViewInit(){
      $('.tags').on('change', (e) => {
        this.indicador.tags=[];
        if(jQuery(e.target).val()){
          jQuery(e.target).val().forEach(
            obj=>{
              this.indicador.tags.push(obj);
            });
          }
      });

      $('.unidadeselect').on('change', (e) => {
        this.indicador.UnidadeCodigo=jQuery(e.target).val();
      });
  }

  private loadIndicador(){
    console.log('loadIndicador');
    this.sub = this.route.params.subscribe(params => {
        console.log('loadIndicador', params);
        this.indicador.codigo = params['codigo'];
        if(this.indicador.codigo){
          this.indicadorService.get(this.indicador.codigo).subscribe(resp=>{
              console.log('Registro em edicao:', this.indicador);
              this.tituloForm = this.indicador.codigo;
              this.titulo = 'Atualiza ' + this.indicador.codigo;
              this.tituloCabecalho = 'Atualiza dados do indicador';
              this.breadcrumb = ['Indicador', this.indicador.codigo];
              this.indicador = Object.assign(this.indicador, resp);
              $('.unidadeselect').val(this.indicador.UnidadeCodigo);
              $('.unidadeselect').trigger('change');
              this.flag_update = true;
              if(resp && resp.hasOwnProperty('Tags'))
                this.updateTagList(resp.Tags);
            }, (err)=> this.util.msgErroInfra(err));
        }
    });
  }

  private updateTagList(tags:any[]) {
    let options = this.selectElRef.nativeElement.options;
    for(let i=0; i < options.length; i++) {
      options[i].selected = tags.find( item=> item.codigo==options[i].value)!=undefined;
    }
    $('.tags').trigger('change');
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private newIndicador(form){
    if(!form.pristine){
      this.util.msgQuestion('Tem certeza que vai sair sem gravar?').then(
        ()=>{ this.router.navigateByUrl('/admin/indicador'); },
        ()=>{  }
      );
    }else{
      this.router.navigateByUrl('/admin/indicador');
    }
  }

  private editConceituacao(flag){
      this.isEditConceituacao = flag;
      if(flag){
        $('.conceituacao').summernote(this.options);
        $('.conceituacao').summernote('code', this.indicador.conceituacao);
      }else{
        this.indicador.conceituacao = $('.conceituacao').summernote('code');
        $('.conceituacao').summernote('destroy');
        this.indicadorService.updateConceituacao(this.indicador.codigo, this.indicador.conceituacao).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucesso(resp.mensagem);
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, err=>this.util.msgErroInfra(err));
      }
  }

  private editMetodoCalculo(flag){
    this.isEditMetodoCalculo = flag;
    if(flag){
      $('.metodo').summernote(this.options);
      $('.metodo').summernote('code', this.indicador.metodo_calculo);
    }else{
      this.indicador.metodo_calculo = $('.metodo').summernote('code');
      $('.metodo').summernote('destroy');
      this.indicadorService.updateMetodoCalculo(this.indicador.codigo, this.indicador.metodo_calculo).subscribe(resp=>{
        if(resp.codret==0){
          this.util.msgSucesso(resp.mensagem);
        }else{
          this.util.msgErro(resp.mensagem);
        }
      }, err=>this.util.msgErroInfra(err));
    }
  }

  private editFonteDados(flag){
    this.isEditFonteDados = flag;
    if(flag){
      $('.fonte').html('<textarea id="fonte_dados" name="fonte_dados" class="form-control" placeholder="Fonte de dados" rows="1" ></textarea>');
      $('textarea#fonte_dados').val(this.indicador.fonte_dados);
    }else{
      this.indicador.fonte_dados = $('textarea#fonte_dados').val();
      this.indicadorService.updateFonteDados(this.indicador.codigo, this.indicador.fonte_dados).subscribe(resp=>{
        if(resp.codret==0){
          this.util.msgSucesso(resp.mensagem);
        }else{
          this.util.msgErro(resp.mensagem);
        }
      }, err=>this.util.msgErroInfra(err));
    }
  }

  private editInterpretacao(flag){
      this.isEditInterpretacao = flag;
      if(flag){
        $('.interpretacao').summernote(this.options);
        $('.interpretacao').summernote('code', this.indicador.interpretacao);
      }else{
        this.indicador.interpretacao = $('.interpretacao').summernote('code');
        $('.interpretacao').summernote('destroy');
        this.indicadorService.updateInterpretacao(this.indicador.codigo, this.indicador.interpretacao).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucesso(resp.mensagem);
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, err=>this.util.msgErroInfra(err));
      }
  }

  private editUsos(flag){
      this.isEditUsos = flag;
      if(flag){
        $('.usos').summernote(this.options);
        $('.usos').summernote('code', this.indicador.usos);
      }else{
        this.indicador.usos = $('.usos').summernote('code');
        $('.usos').summernote('destroy');
        this.indicadorService.updateUso(this.indicador.codigo, this.indicador.usos).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucesso(resp.mensagem);
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, err=>this.util.msgErroInfra(err));
      }
  }

  private editProcedimentoOperacional(flag){
      this.isEditProcedimentoOperacional = flag;
      if(flag){
        $('.procedimento_operacional').summernote(this.options);
        $('.procedimento_operacional').summernote('code', this.indicador.procedimento_operacional);
      }else{
        this.indicador.procedimento_operacional = $('.procedimento_operacional').summernote('code');
        $('.procedimento_operacional').summernote('destroy');
        this.indicadorService.updateProcedimentoOperacional(this.indicador.codigo, this.indicador.procedimento_operacional).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucesso(resp.mensagem);
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, err=>this.util.msgErroInfra(err));
      }
  }

  private editLimitacoes(flag){
      this.isEditLimitacoes = flag;
      if(flag){
        $('.limitacoes').summernote(this.options);
        $('.limitacoes').summernote('code', this.indicador.limitacoes);
      }else{
        this.indicador.limitacoes = $('.limitacoes').summernote('code');
        $('.limitacoes').summernote('destroy');
        this.indicadorService.updateLimitacao(this.indicador.codigo, this.indicador.limitacoes).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucesso(resp.mensagem);
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, err=>this.util.msgErroInfra(err));
      }
  }

  private editNotas(flag){
      this.isEditNotas = flag;
      if(flag){
        $('.notas').summernote(this.options);
        $('.notas').summernote('code', this.indicador.notas);
      }else{
        this.indicador.notas = $('.notas').summernote('code');
        $('.notas').summernote('destroy');
        this.indicadorService.updateNota(this.indicador.codigo, this.indicador.notas).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucesso(resp.mensagem);
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, err=>this.util.msgErroInfra(err));
      }
  }

  private editObservacoes(flag){
      this.isEditObservacoes = flag;
      if(flag){
        $('.observacoes').summernote(this.options);
        $('.observacoes').summernote('code', this.indicador.observacoes);
      }else{
        this.indicador.observacoes = $('.observacoes').summernote('code');
        $('.observacoes').summernote('destroy');
        this.indicadorService.updateObservacao(this.indicador.codigo, this.indicador.observacoes).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucesso(resp.mensagem);
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, err=>this.util.msgErroInfra(err));
      }
  }

  async onSubmit(form){
    let valor: Indicador = Object.assign(this.indicador, form.value);
    $(':input[type="submit"]').prop('disabled', false);
    if(form.valid && this.validacaoAdicional(valor)){
      if(this.flag_update){
        // Atualiza dados
        this.indicadorService.update(valor).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucessoEdicao(resp.mensagem);
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, err=>{
          this.util.msgErro(JSON.parse(err._body).message);
        });
      }else{
        // Inclui um novo
        valor['codigo'] = form.value.codigo_edit.toUpperCase();

        // ------------------------------------------------------------
        //FIX: coloca validacao repeticao na tela (validador)
        let isExistsCodigo = await this.isExists(valor['codigo'] );

        console.log('TEstando');

        if(isExistsCodigo){
          this.util.msgSucessoEdicao(`Código ${valor['codigo']} já existe no cadastro.`);
          return false;  // Nao continua
        }

        // ------------------------------------------------------------
        // Cadastra um novo indicador
        this.indicadorService.create(valor).subscribe(resp=>{
          if(resp.codret==0){
            this.util.msgSucesso(resp.mensagem);
            this.router.navigateByUrl('/admin/indicador/'+ valor.codigo);
          }else{
            this.util.msgErro(resp.mensagem);
          }
        }, (err)=>{
          this.util.msgErro(JSON.parse(err._body).message);
        });
      }
    }else{
      this.util.msgErro('Erro de validação de campos');
    }
    return true;
  }

  async isExists(id){
    let indicador = await this.indicadorService.getSync(id);
    console.log('Indicador====>', indicador);
    return indicador.id!=0;
  }

  private validacaoAdicional(valor){
    let resposta = true;

    resposta = resposta && valor.UnidadeCodigo;
    //TODO: Não consegui fazer validação do bootstrap funcionar para o campo select2 da unidade
    if(!valor.UnidadeCodigo){
      this.util.msgErro('Unidade é obrigatória');
    }
    return resposta;
  }
  private adicionaItemRelacionado(){
    let valorSelecionado = $('#item_relacionado').val();
    let id:number = $(`#listInd option[value='${valorSelecionado}']`).attr('codigo');
    if(id){
      this.indicadorService.adicionaIndicadorRelacionado(this.indicador.id, id).subscribe(resp=>{
      if(resp.codret==0){
        this.util.msgSucesso(resp.mensagem);
        $('#item_relacionado').val('');
        this.loadIndicador();
      }else{
        this.util.msgErro(resp.mensagem);
      }
    }, err=>this.util.msgErroInfra(err));
    }else{
        this.util.msgErro('Preencha o indicador relacionado');
    }
  }

  private apagaItemRelacionado(id:number){
    this.indicadorService.deleteIndicadorRelacionado(this.indicador.id, id).subscribe(resp=>{
      if(resp.codret==0){
        this.util.msgSucesso(resp.mensagem);
        this.loadIndicador();
      }else{
        this.util.msgErro(resp.mensagem);
      }
    }, err=>this.util.msgErroInfra(err));
  }

  private adicionaItemResponsavelGerencial(){
    let id = $('#unidade_gerencial').val();
    if(id){
      console.log('adicionaItemResponsavelGerencial', id);
      this.indicadorService.adicionaResponsavelGerencial(this.indicador.id, id).subscribe(resp=>{
        if(resp.codret==0){
          this.util.msgSucesso(resp.mensagem);
          $('#unidade_gerencial').select2('val','0');
          this.loadIndicador();
        }else{
          this.util.msgErro(resp.mensagem);
        }
      }, err=>this.util.msgErroInfra(err));
    }else{
        this.util.msgErro('Preencha a unidade responsável gerencial');
    }
  }

  private deleteItemResponsavelGerencial(id: number){
    this.indicadorService.deleteResponsavelGerencial(this.indicador.id, id).subscribe(resp=>{
      if(resp.codret==0){
        this.util.msgSucesso(resp.mensagem);
        this.loadIndicador();
      }else{
        this.util.msgErro(resp.mensagem);
      }
    }, err=>this.util.msgErroInfra(err));
  }

  private adicionaItemResponsavelTecnico(){
    let id = $('#unidade_tecnica').val();
    if(id){
      this.indicadorService.adicionaResponsavelTecnico(this.indicador.id, id).subscribe(resp=>{
        if(resp.codret==0){
          this.util.msgSucesso(resp.mensagem);
          $('#unidade_tecnica').select2('val','0');
          this.loadIndicador();
        }else{
          this.util.msgErro(resp.mensagem);
        }
      }, err=>this.util.msgErroInfra(err));
    }else{
        this.util.msgErro('Preencha o indicador relacionado');
    }
  }

  private deleteItemResponsaveTecnico(id: number){
    this.indicadorService.deleteResponsavelTecnico(this.indicador.id, id).subscribe(resp=>{
      if(resp.codret==0){
        this.util.msgSucesso(resp.mensagem);
        this.loadIndicador();
      }else{
        this.util.msgErro(resp.mensagem);
      }
    }, err=>this.util.msgErroInfra(err));
  }

  private adicionaCategoriaRelacionada(){
    let valorSelecionado = $('#categoria_relacionada').val();
    let codigo_categoria_analise:string = $(`#listacat option[value='${valorSelecionado}']`).attr('codigo');
    if(codigo_categoria_analise){
      this.indicadorService.adicionaCategoriaRelacionada(this.indicador.id, codigo_categoria_analise).subscribe(resp=>{
      if(resp.codret==0){
        this.util.msgSucesso(resp.mensagem);
        $('#categoria_relacionada').val('');
        this.loadIndicador();
      }else{
        this.util.msgErro(resp.mensagem);
      }
    }, err=>this.util.msgErroInfra(err));
    }else{
        this.util.msgErro('Preencha a categoria de análise');
    }
  }

  private apagaCategoriaRelacionada(codigo_categoria_analise:string){
    this.indicadorService.deleteCategoriaRelacionada(this.indicador.id, codigo_categoria_analise).subscribe(resp=>{
      if(resp.codret==0){
        this.util.msgSucesso(resp.mensagem);
        this.loadIndicador();
      }else{
        this.util.msgErro(resp.mensagem);
      }
    }, err=>this.util.msgErroInfra(err));
  }

  private formataNomeUnidade():string{
    if(this.indicador.UnidadeResponsavel){
      return `[${ this.indicador.UnidadeResponsavel.sigla }] - ${this.indicador.UnidadeResponsavel.nome}`;
    }
    return '';
  }

  formatTelaFloat(valor:number){
    let ans = null;
    if (valor){
      ans = String(valor).replace('.',',');
    }
    return ans;
  }

  loadData(codigo, tipo, componente){
    console.log('Codigo', codigo);
    if(this.isIndicadorTemGrafico()){
      this.consultaService.search(codigo, '-1', tipo).then((resp)=>{
        componente.add(this.agruparesultindicador(codigo,resp));
      });
    }
  }

  agruparesultindicador(codigo,arr){
    let lcodigo = codigo.toLowerCase();
    let ans = arr.sort((a,b)=> a[lcodigo]<b[lcodigo]? 1: -1);
    if(ans.length > 50){
      ans = ans.slice(0,50);
    }
    return ans;
  }

  isIndicadorTemGrafico(){
    return this.indicador.ultima_atualizacao && this.indicador.GranularidadeCodigo>2 && (this.indicador.CriterioAgregacaoCodigo!=0 || this.indicador.GranularidadeCodigo == 3);
  }

  getLabel(){
    let ans:string = '';
    switch(this.indicador.Granularidade.sigla){
      case 'MN':
        ans = 'local'
        break;
      case 'UF':
        ans = 'uf'
        break;
    }
    return ans;
  }
}
