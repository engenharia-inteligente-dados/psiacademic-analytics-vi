import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { IPagination } from '../../interfaces/pagination.interface';

@Component({
    selector: 'paginacao',
    templateUrl: './paginacao.component.html',
    styleUrls: ['./paginacao.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class PaginacaoComponent implements OnInit {
  @Input() paginacao: IPagination;
  @Output() paginaChange = new EventEmitter<IPagination>();

  limitForm = new FormControl(0, [Validators.min(1)]);

  constructor() {
    this.limitForm.valueChanges.subscribe((value) => {
      this.paginacao.limite = value;
      this.paginaChange.emit(this.paginacao);
    });
  }

  ngOnInit(): void {
    this.limitForm.setValue(this.paginacao.limite);
  }

  changePage(page: number) {
    if (
      this.paginacao.limite > this.paginacao.total ||
      page === 0 ||
      page === this.paginacao.pagina
    ) {
      return;
    }
    this.paginacao.pagina = page;
    this.paginaChange.emit(this.paginacao);
  }
}
