import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'consult-loading',
    templateUrl: './consult-loading.component.html',
    styleUrls: ['./consult-loading.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ConsultLoadingComponent implements OnInit, OnChanges {
  @Input() loading:boolean = false
  constructor(
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if(changes.loading) {
      this.loading = changes.loading.currentValue;
      this.cdref.detectChanges();
    }
  }
}
