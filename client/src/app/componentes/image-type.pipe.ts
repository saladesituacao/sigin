import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'imgtype'})
export class ImageTypePipe implements PipeTransform {
  private transf = {'vnd.openxmlformats-officedocument.wordprocessingml.document':'winword',
                    'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'excel'};

  transform(value: any ) : string {
    console.log('ImageType',value);
    let regexp = new RegExp('(.*)\/(.*)');
    let valores = regexp.exec(value);
    let filename = 'file';

    if(valores && valores.length>1){
      filename = regexp.exec(value)[2]; //pega pela extensão
    }else{
      console.log('Tipo de arquivo não encontrado', value);
    }

    if(this.transf[filename]){
      filename = this.transf[filename];
    }

    return `assets/img/files/${filename}.png`;
  }
}
