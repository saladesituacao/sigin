import {Tag} from './tag';

export class TagCategoria{
  codigo: number=0;
  descricao: string;
  Tags: Tag[];
  constructor(){
    this.Tags = [];
  }
}
