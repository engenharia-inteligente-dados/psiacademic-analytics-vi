import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { createPopper } from '@popperjs/core';
import { PopoverPositions } from '../../enums/popoverPositions.enum';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'tabela',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TableComponent implements OnInit {
  @Input() titulo: string;
  @Input() campos: any[];
  @Input() linhas: any[] = [];
  @Input() light = true;
  @Input() haslegendas = true
  @Output() emit = new EventEmitter<any>();
  private togglePopover = false;
  private popover: any;
  @ViewChild('legendasBtnRef', { static: false }) legendasBtnRef: ElementRef;
  constructor(
    private ref: ChangeDetectorRef
    ) {}

  ngOnInit(): void {
      this.setPopoverText();
  }


  async setPopoverText() {
    const acoes = this.campos.find((campo) => !!campo.acoes);
    this.popover = document.createElement('div');
    if (!!acoes) {
      let li = ``;
      acoes.acoes.forEach((element) => {
        li += `<li class="border-b border-gray-200 px-1 py-2">
        <i class="${element.icon} text-gray-700"></i>
        ${element.label}
        </li>`;
      });
      this.popover.innerHTML = `
      <div id="arrow" data-popper-arrow></div>
      <div class="bg-white border-0 mr-3 block z-50 font-normal leading-normal text-sm max-w-xs text-left no-underline break-words rounded-lg shadow">
      <div class=" p-3">
      <ul class="list-none">
      ${li}
      </ul>
      </div>
      </div>
      `;
    } else {
          this.popover.innerHTML = `<div class="bg-white border-0 block font-normal text-sm rounded-lg">
          <ul class="list-none">
            <li class="border-b border-gray-200">
              <span>Não Possui ações ou legendas especificas</span>
            </li>
          </ul>
        </div>
        <div data-popper-arrow></div>`
    }
  }

  toggle() {
    if (this.togglePopover) {
      this.popover.parentNode.removeChild(this.popover);
      this.togglePopover = false;
    } else {
      this.togglePopover = true;
      this.createPopover();
    }
    this.ref.detectChanges();
  }

  createPopover(){
    createPopper(this.legendasBtnRef.nativeElement, this.popover, {
      placement: PopoverPositions.Bottom,
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 8]
          }
        }
      ]
    });
    this.legendasBtnRef.nativeElement.parentNode.insertBefore(
      this.popover,
      this.legendasBtnRef.nativeElement.nextSibling
    );
  }

  emitAcao(acao: number, linha: any) {
    this.emit.emit({ acao, linha });
  }
}
