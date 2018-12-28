import {CategoriaAnalise, UnidadeResponsavel, Granularidade, Tag, Polaridade} from './index';

export class Indicador{
    id:number = 0;
    codigo:string = '';
    titulo:string = '';
    descricao:string = '';
    ClassificacaoIndicadorCodigo:number = 0;
    Classificacao6sIndicadorCodigo:number = 0;
    ClassificacaoMSIndicadorCodigo:number = 0;
    UnidadeMedidaCodigo:number = 2;
    metodo_calculo:string = '';
    conceituacao:string = '';
    interpretacao:string = '';
    usos:string = '';
    limitacoes:string = '';
    notas:string = '';
    observacoes:string = '';
    fonte_dados:string = '';
    carga_manual:boolean = false;
    acumulativo: boolean = false;
    ativo:boolean = true;
    privado:boolean = false;
    TipoConsultaCodigo:number = 0;
    ParametroFonteCodigo:number = null;
    BancoDadosCodigo:number = 0;
    referencia_consulta:string;
    procedimento_operacional:string;
    secretaria:number = null;
    UnidadeCodigo:number = 1;
    GranularidadeCodigo:number = 0;
    CriterioAgregacaoCodigo:number = 0;
    PeriodicidadeAtualizacaoCodigo:number = 30;
    PeriodicidadeAvaliacaoCodigo:number = 30;
    PeriodicidadeMonitoramentoCodigo:number = 30;
    especifico:boolean = false;
    parametro: number =null;
    ultima_atualizacao:any = null;
    PolaridadeCodigo:number = 0;
    Granularidade:Granularidade;
    tags:Tag[];
    IndicadoresRelacionados:Indicador[];
    CategoriasAnalise:CategoriaAnalise[];
    ResponsavelTecnico:UnidadeResponsavel[];
    ResponsavelGerencial:UnidadeResponsavel[];
    UnidadeResponsavel:UnidadeResponsavel;
  constructor(){
    this.IndicadoresRelacionados = [];
    this.ResponsavelTecnico = [];
    this.IndicadoresRelacionados = [];
    this.ResponsavelGerencial = [];
    this.CategoriasAnalise = [];
    this.tags = [];
  }
}
