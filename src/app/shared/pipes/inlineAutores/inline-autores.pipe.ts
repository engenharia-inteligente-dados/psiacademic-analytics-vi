import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'inlineAutores',
    standalone: false
})
export class InlineAutoresPipe implements PipeTransform {

  transform(value: string[]): string {
    if(Array.isArray(value)){
      return value.join('; ');
    }
    return value;
  }

}
