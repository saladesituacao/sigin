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
@Pipe({name: 'cpf'})
export class CPFPipe implements PipeTransform {


  transform(value:string ) : string {
    return value.substr(0, 3) +'.' + value.substr(3,3)+ '.' + value.substr(6,3)+ '-' + value.substr(9, 2);
  }
}
