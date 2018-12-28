import { Pipe, PipeTransform } from '@angular/core';

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize:precision
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
*/
@Pipe({name: 'fone'})
export class FonePipe implements PipeTransform {


  transform(value:string ) : string {
    if(value.length==10)
      return '('+value.substr(0, 2) +') ' + value.substr(2,4)+ '-' + value.substr(6,4);
    else if (value.length==11)
      return '('+value.substr(0, 2) +') ' + value.substr(2,5)+ '-' + value.substr(7,4);
    else
      return '';
  }
}
