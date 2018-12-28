export class UnidadeResponsavel{
  codigo: number = 0;
  sigla: string = '';
  nome: string = '';
  email: string = '';
  telefone:string;
  competencia:string;
  atividade:string;
  isInformal:boolean;
  unidade_pai:number;
  constructor(){
    this.isInformal = false;
    this.codigo=null;
  }
}
