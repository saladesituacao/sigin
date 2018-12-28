import { Component, ViewChild, NgZone } from '@angular/core';
import {WindowRef} from '../WindowRef';
import { Router } from '@angular/router';
import { BancoDadosService, UtilService } from '../../services/index';

@Component({
  templateUrl: 'unidade-medida.component.html',
})
export class BancoDadosComponent {
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
    {"data": "descricao"},
  ],
  "order": [[1, 'asc']]
  }
  @ViewChild('listBancoDados') tabelaBancos;
  constructor(private bancoDadosService:BancoDadosService, private util:UtilService,
    private router: Router,
    private zone:NgZone,
    private winRef: WindowRef) {
    winRef.nativeWindow.angularComponentRef = {
      zone: this.zone,
      componentFn: (value) => this.apagaBancoDados(value),
      component: this
    };
    winRef.nativeWindow.angularComponentRef = {
      zone: this.zone,
      componentFn: (value) => this.editaBancoDados(value),
      component: this
    };
  }


  private getBancoDados(){
    this.tabelaBancos.clear();
    this.bancoDadosService.getAll().subscribe((resp)=>{
      resp.unidades.forEach(item=>{
        this.tabelaBancos.addRow(item);
      });
      this.tabelaBancos.draw();
    }, err=>this.util.msgErroInfra(err));
  }

  private detailsFormat(d) {
      let strBancoDados:string='';
      let numTotal:number = 1;
      strBancoDados += `<tr>
                          <td>${d.descricao}</td>
                      </tr>`;


      return `<h4>Unidade de Medida</h4>
              <div style="padding: 30px">
              <table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed">
              <thead>
               <tr>
                  <th>Descrição</th>
               </tr>
              </thead>
              <tbody>
              ${strBancoDados}
              </tbody>
              <tr>
                 <td class="text-right"><b>Total de registros:</b> &nbsp;${numTotal}</td>
              </tr>
              </tfoot>
          </table>
          <div style="padding: 5px">
              <button class='btn btn-xs btn-danger pull-right' style='margin-left:5px'
                onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.apagaUnidadeMedida('${d.codigo}');})">
                <i class="fa fa-times "></i>&nbsp;Apaga
              </button>
              <button class='btn btn-xs btn-info pull-right'
                onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.editaUnidadeMedida('${d.codigo}');})">
                <i class="fa fa-pencil "></i>&nbsp;Edita
              </button>
          </div>
          </div>`
    }

    editaBancoDados(codigo:number){
      this.router.navigate(['/admin/banco-dados', codigo]);
    }

    apagaBancoDados(codigo:number){
      this.bancoDadosService.apaga(codigo).subscribe(resp=>{
          console.log(resp);
          if(!resp.codret){
            this.util.msgSucessoDelete(resp.mensagem);
            this.tabelaBancos.deleteRow(codigo);
          }else
            this.util.msgErro(resp.mensagem);
        }, err=>{ this.util.msgErroInfra(JSON.parse(err._body).message)});
    }


}
