import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'spinner',
    templateUrl: './spinner.component.html',
    styleUrls: ['./spinner.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class SpinnerComponent implements OnInit, OnChanges {
  @Input() loading;
  constructor(
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.loading) {
      this.loading = changes.loading.currentValue;
      this.cdref.detectChanges();
    }
  }
}
