import { Component, ViewChild, NgZone } from '@angular/core';
import {WindowRef} from '../WindowRef';
import { Router } from '@angular/router';
import { FonteParametroService, UtilService } from '../../services/index';

@Component({
  templateUrl: 'fonte.component.html',
})
export class FonteComponent {
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
    {"data": "sigla"},
    {"data": "descricao"},
  ],
  "order": [[1, 'asc']]
  }
  @ViewChild('listFonte') tabelaFonte;
  constructor(private fonteService:FonteParametroService, private util:UtilService,
    private router: Router,
    private zone:NgZone,
    private winRef: WindowRef) {
    winRef.nativeWindow.angularComponentRef = {
      zone: this.zone,
      componentFn: (value) => this.apagaFonteDados(value),
      component: this
    };
    winRef.nativeWindow.angularComponentRef = {
      zone: this.zone,
      componentFn: (value) => this.editaFonteDados(value),
      component: this
    };
  }


  private getFontes(){
    this.tabelaFonte.clear();
    this.fonteService.getAll().subscribe((resp)=>{
      resp.fontes.forEach(item=>{
        this.tabelaFonte.addRow(item);
      });
      this.tabelaFonte.draw();
    }, err=>this.util.msgErroInfra(err));
  }

  private detailsFormat(d) {
    //console.log('Passei aqui', d);
      let strFonte:string='';
      let numTotal:number = 1;
      strFonte += `<tr>
                          <td>${d.sigla}</td>
                          <td>${d.descricao}</td>
                      </tr>`;


      return `<h4>Fonte de Dados</h4>
              <div style="padding: 30px">
              <table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed">
              <thead>
               <tr>
                  <th width='10%'>Sigla</th>
                  <th>Descrição</th>
               </tr>
              </thead>
              <tbody>
              ${strFonte}
              </tbody>
              <tr>
                 <td class="text-right"><b>Total de registros:</b> &nbsp;${numTotal}</td>
              </tr>
              </tfoot>
          </table>
          <div style="padding: 5px">
              <button class='btn btn-xs btn-danger pull-right' style='margin-left:5px'
                onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.apagaFonteDados('${d.codigo}');})">
                <i class="fa fa-times "></i>&nbsp;Apaga
              </button>
              <button class='btn btn-xs btn-info pull-right'
                onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.editaFonteDados('${d.codigo}');})">
                <i class="fa fa-pencil "></i>&nbsp;Edita
              </button>
          </div>
          </div>`
    }

    editaFonteDados(codigo:number){
      this.router.navigate(['/admin/fonte-dados', codigo]);
    }

    apagaFonteDados(codigo:number){
      this.fonteService.apaga(codigo).subscribe(resp=>{
          //console.log(resp);
          if(!resp.codret){
            this.util.msgSucessoDelete(resp.mensagem);
            this.tabelaFonte.deleteRow(codigo);
          }else
            this.util.msgErro(resp.mensagem);
        }, err=>{ this.util.msgErroInfra(JSON.parse(err._body).message)});
    }


}
