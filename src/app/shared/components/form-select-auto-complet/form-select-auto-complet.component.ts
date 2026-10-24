import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormControl } from '@angular/forms';


@Component({
    selector: 'select-auto-complet',
    templateUrl: './form-select-auto-complet.component.html',
    styleUrls: ['./form-select-auto-complet.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FormSelectAutoCompletComponent implements OnInit {
  private readonly _defaultSelect = `Selecione uma Opção`;
  @Input() label: string = ''
  @Input() options: any[];
  @Input() selectedDefault?: string = this._defaultSelect;
  @Output() optionChange = new EventEmitter<any>();

  selectForm: any;
  constructor() {}

  ngOnInit(): void {
    this.selectForm = this.selectedDefault;
  }

  onOptionChange(event: any) {
    if (this.selectForm !== this._defaultSelect) {
      this.optionChange.emit({ newValue: this.selectForm, label:this.label });
    }
  }
}
