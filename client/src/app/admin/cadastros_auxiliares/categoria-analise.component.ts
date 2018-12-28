import { Component, ViewChild, NgZone } from '@angular/core';
import {WindowRef} from '../WindowRef';
import { Router } from '@angular/router';
import {ModalDirective} from "ngx-bootstrap";
import { CategoriaAnaliseService, UtilService } from '../../services/index';

@Component({
  templateUrl: 'categoria-analise.component.html',
})
export class CategoriaAnaliseComponent {

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
    {"data": "codigo"},
    {"data": "titulo"},
  ],
  "order": [[1, 'asc']]
  }
  constructor(private categoriaAnaliseService:CategoriaAnaliseService,
    private util:UtilService,
    private router: Router,
    private zone:NgZone,
    private winRef: WindowRef) {
    winRef.nativeWindow.angularComponentRef = {
      zone: this.zone,
      componentFn: (value) => this.apagaCategoriaAnalise(value),
      component: this
    };
    winRef.nativeWindow.angularComponentRef = {
      zone: this.zone,
      componentFn: (value) => this.editaCategoriaAnalise(value),
      component: this
    };
  }
  @ViewChild('listaCategorias') tabelaCategorias;

  private getCategorias(){
    this.tabelaCategorias.clear();
    this.categoriaAnaliseService.getAll().subscribe((resp)=>{
      resp.categorias_analise.forEach(item=>{
        this.tabelaCategorias.addRow(item);
      });
      this.tabelaCategorias.draw();
    }, err=>this.util.msgErroInfra(err));
  }

  private detailsFormat(d) {
      let strCategorias:string='';
      let numTotal:number = d.Itens.length;
      d.Itens.forEach(item => {
        strCategorias += `<tr>
                          <td>${item.descricao}</td>
                      </tr>`;

      });


      return `<h4>Subcategorias</h4>
              <div style="padding: 30px">
              <table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed">
              <thead>
               <tr>
                  <th>Descrição</th>
               </tr>
              </thead>
              <tbody>
              ${strCategorias}
              </tbody>
              <tr>
                 <td class="text-right"><b>Total de registros:</b> &nbsp;${numTotal}</td>
              </tr>
              </tfoot>
          </table>
          <div style="padding: 5px">
              <button class='btn btn-xs btn-danger pull-right' style='margin-left:5px'
                onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.apagaCategoriaAnalise('${d.codigo}');})">
                <i class="fa fa-times "></i>&nbsp;Apaga
              </button>
              <button class='btn btn-xs btn-info pull-right'
                onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.editaCategoriaAnalise('${d.codigo}');})">
                <i class="fa fa-pencil "></i>&nbsp;Edita
              </button>
          </div>
          </div>`
    }

    editaCategoriaAnalise(codigo:string){
      this.router.navigate(['/admin/categoria-analise', codigo]);
    }

    apagaCategoriaAnalise(codigo:string){
      this.util.msgQuestion(`Tem certeza que vai apagar a categoria ${codigo}?`).then(
        ()=>{
          this.categoriaAnaliseService.apaga(codigo).subscribe(resp=>{
              console.log(resp);
              if(!resp.codret){
                this.util.msgSucessoDelete(resp.mensagem);
                this.tabelaCategorias.deleteRow(codigo);
              }else
                this.util.msgErro(resp.mensagem);
            }, err=>{
              console.log('Erro', err);
              this.util.msgErroInfra("Erro ao apagar Categoria de Análise")});
        }
      );

    }
}
