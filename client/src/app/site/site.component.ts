import { Component, OnInit } from '@angular/core';
import {FadeInTop} from "../shared/animations/fade-in-top.decorator";
import { IndicadorService, UtilService, ConsultaService, ParametroService } from '../services/index';

@FadeInTop()
@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
})
export class SiteComponent implements OnInit {
  private listaIndicadores:any[];
  private listaIndicadorPorUnidade:any[];
  private listaIndicadorPorTag:any[];
  private page: number =1;
  private total: number = 0;
  private itensPorPagina: number = 20;
  private pesquisa:Object = {};
  private minha_pesquisa:string = '';

  buscaDados(){
    this.pesquisa['query'] = this.minha_pesquisa;
    this.pageChanged(1);
  }

  constructor(private indicadorService:IndicadorService,
    private consultaService:ConsultaService, private parametroService: ParametroService) { }

  ngOnInit() {
    this.parametroService.load();
    if(localStorage.getItem('pesquisa_site')){
      this.pesquisa = JSON.parse(localStorage.getItem('pesquisa_site'));
    }else{
      this.pesquisa = {};
    }

    this.page  = localStorage.getItem('pagina_site')? +(localStorage.getItem('pagina_site')):1;

    this.pageChanged(this.page);
    this.loadIndicadorPorUnidade();
    this.loadIndicadorPorTag();
  }

  pageChanged(pagina:number){
    this.loadIndicador(pagina);
  }

  async loadIndicador(pagina:number){
    this.page = pagina;
    var offset = (pagina-1) * this.itensPorPagina;

    // Guarda pesquisa
    localStorage.setItem('pesquisa_site', JSON.stringify(this.pesquisa));
    // Guarda pagina
    localStorage.setItem('pagina_site', String(this.page));

    console.log('Armazenado:', localStorage.getItem('pesquisa_site'));

    let resp = await this.indicadorService.getAllSync(this.itensPorPagina, offset, this.formataPesquisa(this.pesquisa));
    //console.log('resp', resp);
    this.total = resp.count;
    this.listaIndicadores=resp.rows;
  }

  loadData(codigo, tipo, componente){
    console.log('Codigo', codigo);
    this.consultaService.search(codigo, '-1', tipo).then((resp)=>{
      componente.add(resp);
    });
  }

  formataPesquisa(objeto: Object):string{
      let resposta:string='';
      if ('query' in objeto){
        resposta+=`query=${objeto['query']}&`;
      }
      if ('tag' in objeto){
        resposta+=`tag=${objeto['tag'][0]}&`;
      }
      if ('unidade' in objeto){
        resposta+=`secretaria=${objeto['unidade'][0]}&`;
      }
      return resposta;
  }

  formataTela(objeto:Object):string{
    let resposta:string='';

    if ('query' in objeto){
      resposta+=`<span class="badge bg-color-greenLight">${objeto['query']}</span>&nbsp;`;
    }
    if ('tag' in objeto){
      resposta+=`<span class="badge bg-color-orange">${objeto['tag'][1]}</span>&nbsp;`;
    }
    if ('unidade' in objeto){
      resposta+=`<span class="badge bg-color-default">${objeto['unidade'][1]}</span>&nbsp;`;
    }
    return resposta;
  }

  formataBadgesTela(label:string, campo:string, color:string, array:any[]):string{
    let resposta:string='';

    array.forEach((item)=>{
      resposta+=`<span class="badge bg-color-${color}">${item[campo]}</span>&nbsp;`;
    });
    if(resposta){
      resposta= '<h4><small class="font-xs"><i>'+label+'</i></small>&nbsp;'+resposta+'</h4>';
    }
    return resposta;
  }

  isEmpty(objeto:Object){
    //console.log('Objeto', objeto);
    return objeto && Object.keys(objeto).length==0;
  }

  loadIndicadorPorUnidade(){
    this.indicadorService.getCountPorUnidade().subscribe(resp=>{
      console.log('Unidades',resp.unidades);
      this.listaIndicadorPorUnidade = resp.unidades;
    });
  }

  loadIndicadorPorTag(){
    this.indicadorService.getCountPorTag().subscribe(resp=>{
      console.log('Tags',resp.tags);
      this.listaIndicadorPorTag = resp.tags.slice(0,9);
    });
  }

  buscaPorTag(codigo:number, sigla:string){
      this.pesquisa['tag'] = [codigo, sigla];
      this.pageChanged(1);
  }

  buscaPorUnidade(codigo:number, nome:string){
      this.pesquisa['unidade'] = [codigo,nome];
      this.pageChanged(1);
  }

  formatData(d){
    var ans:string = '';
    if(d){
      switch(d.length){
        case 4:
          ans = `ano ${d}`;
          break;
        case 6:
          ans = d;
          break
      }
    }
    return ans;
  }

  limpaFiltro(){
    this.pesquisa = {};
    this.pageChanged(1);
  }

  getData(codigo: string, ultima_atualizacao:string, objPeriodicidade: Object, granularidade: number, criterio_agregacao:number){
    //console.log(codigo, ultima_atualizacao, objPeriodicidade, granularidade, criterio_agregacao);

    /*if(!ultima_atualizacao)
      return null;
    if(this.vardata[codigo] && this.vardata[codigo].length>0)
      return this.vardata[codigo];

    console.log(codigo);
    switch(granularidade){
      case 3: // Municipal
        this.vardata[codigo] = [];
        if(criterio_agregacao!=0){
          this.vardata[codigo]= await this.consultaService.search(codigo, '-1', 'UF');
          console.log('Resultdo:',this.vardata[codigo]);
        }
        break;
    }
    return this.vardata[codigo];*/
    //console.log('getData', codigo);
    return [{ano: 2014, uf: 'AL', y: 100}, {ano: 2013, uf: 'SE', y:110}];
    //return [{"x":"2011 Q1","y":3,"z":2,"a":3},{"x":"2011 Q2","y":2,"z":null,"a":1},{"x":"2011 Q3","y":0,"z":2,"a":4},{"x":"2011 Q4","y":2,"z":4,"a":3}];
  }

  barColorsDemo(row, series, type) {
    if (type === 'bar') {
      var red = Math.ceil(150 * row.y / 8);
      return 'rgb(' + red + ',0,0)';
    } else {
      return '#000';
    }
  }

}
