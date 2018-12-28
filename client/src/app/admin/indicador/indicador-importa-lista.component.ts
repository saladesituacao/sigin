import {Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FadeInTop} from "../../shared/animations/fade-in-top.decorator";
import {ModalDirective} from 'ngx-bootstrap';
import { IndicadorService, UtilService } from '../../services/index';
import { Arquivo, Indicador } from '../../model/index';
import {WindowRef} from '../WindowRef';


@FadeInTop()
@Component({
  selector: 'app-projects',
  templateUrl: './indicador-importa-lista.component.html',
})

export class IndicadorImportaListaComponent implements OnInit {
    @ViewChild('listaIndicadores') private tabelaIndicadores;
    @ViewChild('importaModal') private importaModal: ModalDirective;
    @ViewChild('formModal') private formModal: ModalDirective;

    private titulo:string='';
    private sub: any;
    private tipo: number=3;
    private colecaoIndicadores: Indicador[]=[];
    private newArquivo: Arquivo;
    private indicadorSelecionado:Indicador;

    public options = {
    "iDisplayLength": 15,
    "oLanguage": {"sUrl": 'assets/api/langs/datatable-br.json'},
    "rowId": 'codigo',
    "searching": true,
    "columns": [
      {
        "class": 'details-control',
        "orderable": false,
        "data": null,
        "defaultContent": ''
      },
      {"data": "titulo"},
      {"data": "codigo"},
      {"data": "PeriodicidadeAtualizacao.descricao"},
      {"data": "ultima_atualizacao"},
      {"data": "tipo_consulta",  "visible":false},
    ],
    "order": [[1, 'asc']]
    }

    constructor(private route: ActivatedRoute,private zone:NgZone, private winRef: WindowRef,
      private indicadorService:IndicadorService,
      private util:UtilService,
      private router:Router) {
        winRef.nativeWindow.angularComponentRef = {
          zone: this.zone,
          componentFn: (value, titulo) => this.importFile(value, titulo),
          component: this
        };
        winRef.nativeWindow.angularComponentRef = {
          zone: this.zone,
          componentFn: (value) => this.openForm(value),
          component: this
        };
      }

    ngOnInit(){
      this.newArquivo = new Arquivo();
      this.indicadorSelecionado = new Indicador();
      this.sub = this.route.params.subscribe(params => {
          this.tipo = params['tipo'];
          this.titulo = this.tipo && this.tipo==3? "Importação":"Formulário";
          console.log('Tipo', this.tipo);
          this.getIndicadores();
      });
    }

    ngOnDestroy(){
      this.sub.unsubscribe();
    }

    detailsFormat(d):string {
      let tituloBotao = d.tipo_consulta==3? "Importa":"Novo registro dados";
      let func = d.tipo_consulta==3? `window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.importFile('${d.codigo}', '${d.titulo}');})`
              : `window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.openForm('${d.codigo}');})`;
      let tituloSubPainel = d.tipo_consulta==3? "Arquivos":"Dados digitados";
      return `
      <h4 style="padding-left: 30px; padding-top: 5px">${tituloSubPainel}</h4>
              <div style="padding: 30px">
              <table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Tipo</th>
                  <th>Arquivo</th>
                  <th>Responsável</th>
                  <th>Data</th>
                  <th>Situação</th>
                  <th>&nbsp;</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td>1</td>
                  <td>Planilha</td>
                  <td>importa_dados.xls</td>
                  <td>André de Souza Campos</td>
                  <td>15/11/2017 13:45</td>
                  <td>Sucesso</td>
                  <td>
                      <a class="btn btn-info btn-xs icon white" title="Seleciona registro"><i class="fa fa-check"></i></a>
                      <a class="btn btn-warning btn-xs icon white" title="Visualiza Log"><i class="fa fa-file"></i></a>
                      <a class="btn btn-danger btn-xs icon white" title="Apaga registro"><i class="fa fa-file"></i></a>
                  </td>
                </tr>
                </tbody>
            </table>
            <div style="padding-top: 15px">
                <button class='btn btn-xs btn-info pull-right'
                  onclick="${func}">
                  <i class="fa fa-pencil "></i>&nbsp;${tituloBotao}
                </button>
            </div>
            </div>`;
    }

    getIndicadores(){
      this.tabelaIndicadores.clear();
      if(this.tabelaIndicadores.isInicializado()){
        this.indicadorService.getPorTipoConsulta(this.tipo).subscribe((resp)=>{
          console.log('Resultado',resp);
          if(resp.count > 0){
            this.colecaoIndicadores = resp.rows;
            this.tabelaIndicadores.addRows(resp.rows);
            this.tabelaIndicadores.draw();
          }
        } , err => this.util.msgErroInfra(err));
      }
    }

    importFile(codigo: string, titulo:string){
      this.newArquivo = new Arquivo();
      console.log('Conjunto', this.colecaoIndicadores);
      console.log('Selecionado', this.colecaoIndicadores.filter(item=> item.codigo == codigo));
      this.indicadorSelecionado = this.colecaoIndicadores.filter(item=>item.codigo === codigo)[0];

      this.importaModal.show();
    }

    openForm(codigo:string){
      this.formModal.show();
    }

    fileChangeEvent(fileInput: any){
      //this.newArquivo = new Arquivo();
      let file = fileInput.target.files[0];
      this.newArquivo.file =  file;
      console.log('fileinput', file, this.newArquivo);
      this.newArquivo.nameFile = file.name;
      this.newArquivo.tamanhoFile = file.size;
      this.newArquivo.formato = file.type;
      this.newArquivo.dataFile = file.lastModifiedDate;
    }

}
