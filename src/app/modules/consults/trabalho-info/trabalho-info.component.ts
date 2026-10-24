import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ITrabalho } from '../../../shared/interfaces/trabalhos.interface';
import { createPopper } from '@popperjs/core';
import { PopoverPositions } from 'src/app/shared/enums/popoverPositions.enum';
@Component({
    selector: 'trabalho-info',
    templateUrl: './trabalho-info.component.html',
    styleUrls: ['./trabalho-info.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class TrabalhoInfoComponent implements OnInit {
  @Input() trabalho: ITrabalho;
  @Output() dismiss = new EventEmitter<any>();
  @ViewChild('alertIconRef', { static: false }) alertIconRef: ElementRef;
  popoverShow = false
  public popper = document.createElement("div");

  constructor(
    ) {}
  ngOnInit(): void {
    this.initPopover()
  }

  initPopover(){
    this.popper.innerHTML = `
    <div id="arrow" data-popper-arrow></div>
    <div class="bg-white border-0 mr-3 block z-50 font-normal leading-normal text-sm max-w-xs text-left no-underline break-words rounded-lg shadow"">
    <div>
      <div class="p-3 mb-0 rounded-t-lg">
        A classificação desse trabalho é realizada, Conforme dados definidos na base de tados e está sujeito a mudança.
      </div>
    </div>
  </div>`;
  }

  toggleTooltip(){
    if(this.popoverShow){
      this.popoverShow = false;
      this.destroyPopper();
    } else {
      this.popoverShow = true;
      this.createPoppper();
    }
  }

  destroyPopper(){
    this.popper.parentNode.removeChild(this.popper);
  }
  createPoppper(){
    createPopper(this.alertIconRef.nativeElement, this.popper, {
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
    this.alertIconRef.nativeElement.parentNode.insertBefore(this.popper, this.alertIconRef.nativeElement.nextSibling);

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

  abrirLink() {
    window.open(this.trabalho.url, '_blank');
  }
}
