import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'resumePipe',
    standalone: false
})
export class ResumePipePipe implements PipeTransform {

  transform(value: string): string {
    const resumo = value.split(".")

    return `${resumo[0]}...`;
  }

}
