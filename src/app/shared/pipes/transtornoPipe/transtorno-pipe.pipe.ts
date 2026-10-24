import { Pipe, PipeTransform } from '@angular/core';
import { TRANSTORNOS_LABELS } from '../../const/transtornoHumanizade.const';

@Pipe({
    name: 'transtornoPipe',
    standalone: false
})
export class TranstornoPipePipe implements PipeTransform {

  private readonly transtorno = TRANSTORNOS_LABELS

  transform(text: string): string {
    const transtorno: { [key: string]: string } = this.transtorno
    return transtorno[text] || text;
  }

}
