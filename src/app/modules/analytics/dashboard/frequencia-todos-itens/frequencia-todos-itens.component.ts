import { Component, Input, OnInit, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'frequencia-todos-itens',
    templateUrl: './frequencia-todos-itens.component.html',
    styleUrls: ['./frequencia-todos-itens.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class FrequenciaTodosItensComponent implements OnInit {
  @Input() campos: any;
  @Input() linhas: any;
  @Input() titulo: string;
  @Output() dismiss: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

  dissmiss(event: any) {
    event.stopPropagation();
    this.dismiss.emit();
  }

  backdropdissmiss(event: any) {
    event.stopPropagation();
    if (event.target !== event.currentTarget) {
      return;
    }
    this.dismiss.emit();
  }


}
