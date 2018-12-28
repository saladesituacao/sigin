import { Component, Input, OnInit, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { ConsultaService, GranularidadeService, UtilService } from '../services/index';
import {WindowRef} from './WindowRef';

declare var $: any;
/**
 * Componente para mostrar dados de resultado de indicadores.
 */
@Component({
    selector: 'resultset',
    template: `
    <div class="row">
        <div class="col-md-12">
          <table id="lista" class="responsive table table-striped table-bordered table-hover" width="100%">
          </table>
        </div>
    </div>`})
export class ResultsetComponent implements OnChanges, OnInit {
    @Input() codigo: string;
    @Input() granularidade:string = '';
    @Input() criterio:number = 0;
    @Input() tipo:number = 0;

    private _dataTable:any;
    private enable:boolean = false;
    private colecaoGranularidade:any[] = [];
    private tipo_granularidade:string;

    constructor(private zone:NgZone, private winRef: WindowRef, private consulta:ConsultaService,
        private granularidadeService: GranularidadeService,
        private util:UtilService){
        winRef.nativeWindow.angularComponentRef = {
          zone: this.zone,
          componentFn: (value) => this.selectGranularidade(value),
          component: this
        };

    }

    ngOnInit(){
      Promise.all([
        System.import('script-loader!smartadmin-plugins/datatables/datatables.min.js'),
      ]).then(()=>{
        this.enable = true;
      });
      this.granularidadeService.getAll().subscribe(resp=>{
          this.colecaoGranularidade = resp.granularidade;
      }, err => this.util.msgErroInfra(err));
    }

    ngOnChanges(changes: SimpleChanges) {
      
      try{
          if(changes.granularidade && changes.granularidade.currentValue){
              this.tipo_granularidade = changes.granularidade.currentValue;
          }
          if(changes.codigo && changes.codigo.currentValue){
              this.codigo = changes.codigo.currentValue;
          }
          if(('tipo' in changes) && !changes.tipo && changes.tipo.currentValue && !this.tipo)
            this.loadData();
      }catch(e){
        console.log('erro no changes',e, changes);
      }
    }

    loadData(){
      if(this.codigo && this.tipo_granularidade){
        this.consulta.search(this.codigo,null,this.tipo_granularidade, 'TAB').then((resp)=>{
            console.log('Resultset',resp);
            if(this.enable){
              this.render(resp.resultset);
            }
        }).catch((err)=>{
          console.log('Erro na consulta:', err);
        });
      }
    }

    render(itens){
      let columns:Object[];

      $('#lista').empty();
      $('#lista').unbind('draw.dt');
      switch(this.tipo_granularidade){
        case 'BR':
          columns = [];
          break;
        case 'MN':
          columns = [
            {"title":'UF',"data": "uf"},
            {"title":'Região',"data": "regiao"},
            {"title":'Município',"data": "local"}
          ];
          break;
        case 'UF':
          columns = [
            {"title":'UF',"data": "uf"},
            {"title":'Região',"data": "regiao"}
          ];
          break;
        case 'RG':
          columns = [
            {"title":'Região',"data": "regiao"}
          ];
          break;
      }

      let cod = this.codigo.toLowerCase();

      // Renderiza coluna de dados (com os itens retornados - por exemplo os anos)
      Object.keys(itens[0]).forEach((key)=>{
          if(key!='null' && typeof(itens[0][key])=='object'){
              //console.log('Construindo coluna: ',key, typeof(itens[0][key]));
              columns.push({"title":key, "className": "text-right", "data": key, "render":
              function ( data, type, row ) {
                if(!data)
                  return '';
                if(type === 'display'){
                    return data[cod].toLocaleString("pt-BR");
                }else if(type === 'sort'){
                    return data[cod];
                }else{
                    return data;
                }
              }
            });
          }
      });

      console.log('Columns:', columns);
      // Associa os dados a tabela de resulados
      this._dataTable = $('#lista').DataTable({
        //"aLengthMenu": [[25,50,100, -1], [25,50, 100, "Todas"]],
        "bLengthChange": false,
        "iDisplayLength": 50,
        "bProcessing": true,
        "oLanguage": {"sUrl": 'assets/api/langs/datatable-br.json'},
        "columns": columns,
        "order": [[0, 'asc']]
        });

        this._dataTable.rows.add(itens);
        this._dataTable.draw();

        if(this.criterio!=0 && this.granularidade){
          var granularidades = this.getGranularidades();

          $('#lista').on( 'draw.dt', function () {
              $("#lista_filter").parent().parent().children().first().html( granularidades);
              $('select#lista_granularidade').change(function (e) {
                  window['angularComponentRef'].zone.run(() => {
                    window['angularComponentRef'].component.selectGranularidade(e.currentTarget.value);
                  });
              });
          });

        }
    }

    private getGranularidades():string{
      let ans:string = '<label>Estratificação: <select id="lista_granularidade" name="granularidade" aria-controls="lista" class="form-control input-sm">';
      let selected:string = '';
      console.log('Tipo', this.tipo);
      for(var item of this.colecaoGranularidade){
        if(item.codigo!=0){
          selected = (item.sigla == this.tipo)? 'selected':'';
          ans += `<option value="${item.sigla}" ${selected}>${item.descricao}</option>`;
        }
        if(item.sigla==this.granularidade){
          break;
        }
      };
      return ans + '</select></label> ';
    }

    private selectGranularidade(valor:string){
      console.log('Valor repassado:', valor);
      this.tipo_granularidade = valor;
      this._dataTable.destroy();
      //this._dataTable.clear();
      //this._dataTable.draw();
      this.loadData();
    }
}
