import { Component, ViewChild,NgZone } from '@angular/core';
import {WindowRef} from '../WindowRef';
import { Router } from '@angular/router';
import { TagCategoriaService, UtilService } from '../../services/index';

@Component({
  templateUrl: 'tag.component.html',
})
export class TagComponent {
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
  @ViewChild('listaTag') tabelaTags;
  constructor(private tagService:TagCategoriaService,
    private util:UtilService,
    private router: Router,
    private zone:NgZone,
    private winRef: WindowRef) {
    winRef.nativeWindow.angularComponentRef = {
      zone: this.zone,
      componentFn: (value) => this.apagaMarcadores(value),
      component: this
    };
    winRef.nativeWindow.angularComponentRef = {
      zone: this.zone,
      componentFn: (value) => this.editaMarcadores(value),
      component: this
    };

  }


  private getTags(){
    this.tabelaTags.clear();
    this.tagService.getAll().subscribe((resp)=>{
      console.log('Resp', resp);
      resp.tag_categorias.forEach(item=>{
        this.tabelaTags.addRow(item);
      });
      this.tabelaTags.draw();
    }, err=>this.util.msgErroInfra(err));
  }

  private detailsFormat(d) {
      let strMarcadores:string='';
      let numTotal:number = d.Tags.length;
      d.Tags.forEach(item => {
        strMarcadores += `<tr>
                          <td>${item.descricao}</td>
                      </tr>`;

      });


      return `<h4>Marcadores</h4>
              <div style="padding: 30px">
              <table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed">
              <thead>
               <tr>
                  <th>Descrição</th>
               </tr>
              </thead>
              <tbody>
              ${strMarcadores}
              </tbody>
              <tr>
                 <td class="text-right"><b>Total de registros:</b> &nbsp;${numTotal}</td>
              </tr>
              </tfoot>
          </table>
          <div style="padding: 5px">
              <button class='btn btn-xs btn-danger pull-right' style='margin-left:5px'
                onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.apagaMarcadores('${d.codigo}');})">
                <i class="fa fa-times "></i>&nbsp;Apaga
              </button>
              <button class='btn btn-xs btn-info pull-right'
                onclick="window.angularComponentRef.zone.run(() => {window.angularComponentRef.component.editaMarcadores('${d.codigo}');})">
                <i class="fa fa-pencil "></i>&nbsp;Edita
              </button>
          </div>
          </div>`
    }

    editaMarcadores(codigo:string){
      this.router.navigate(['/admin/tag', codigo]);
    }

    apagaMarcadores(codigo:string){
      this.util.msgQuestion(`Tem certeza que vai apagar a categoria ${codigo}?`).then(
        ()=>{
          this.tagService.apaga(codigo).subscribe(resp=>{
              console.log(resp);
              if(!resp.codret){
                this.util.msgSucessoDelete(resp.mensagem);
                this.tabelaTags.deleteRow(codigo);
              }else
                this.util.msgErro(resp.mensagem);
            }, err=>{ this.util.msgErroInfra(JSON.parse(err._body).message)});
      });
    }


}
