import { UnidadeResponsavel, Perfil, StatusAprovacao } from '../model/index';

export class User{
  codigo: number = 0;
  login: string = '';
  cpf: string = '';
  nome: string = '';
  email: string = '';
  ramal: string= '';
  celular: string = '';
  telefone: string = '';
  cargo: string = '';
  Unidade: UnidadeResponsavel;
  sexo: string = '';
  Perfil: Perfil;
  Situacao: StatusAprovacao;
  PerfilCodigo: number;
  SituacaoCodigo: number;
  UnidadeCodigo: number;

  constructor(){
  }
}
