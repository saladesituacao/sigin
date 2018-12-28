import { Component, ViewChild } from '@angular/core';
import { UsuarioService, UtilService } from '../../services/index';

@Component({
  templateUrl: 'usuario.component.html',
})
export class UsuarioComponent {
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
    {"data": "nome"},
    {"data": "cpf"},
    {"data": "ramal"},
    {"data": "celular"},
    {"data": "dt_atualizacao", render: function(data, type, full, meta){
      if(type == "display"){
        var dt = new Date(data)
        return dt.toLocaleDateString('pt-BR') + ' - ' +dt.toLocaleTimeString('pt-BR');
      }
      return data;
    }},
  ],
  "order": [[1, 'asc']]
  }
  @ViewChild('listaUsuario') tabelaUsuarios;

  constructor(private usuarioService:UsuarioService, private util:UtilService) {  }


  private getUsuarios(){
    this.tabelaUsuarios.clear();
    this.usuarioService.getAll().subscribe((resp)=>{
      resp.users.forEach(item=>{
        console.log(item);
        this.tabelaUsuarios.addRow(item);
      });
      this.tabelaUsuarios.draw();
    }, err=>this.util.msgErroInfra(err));
  }

  private detailsFormat(d) {
      let strPerfil:string='';
      let listaPerfil = {ADM: 'Administrativo', ANA: 'Analista', USR: 'Usuário'};
      d.perfis.forEach(item => {
        strPerfil += `<tr>
                          <td style="width:100px">&nbsp;</td>
                          <td style="width:100px">${item}</td>
                          <td>${listaPerfil[item]}</td>
                      </tr>`;

      });


      return `<table cell-padding="5" cell-spacing="0" border="0" class="table table-hover table-condensed">
              <tbody>
              <tr><td colspan="3">Perfis:</td></tr>
              ${strPerfil}
              </tbody>
          </table>`
    }

}
