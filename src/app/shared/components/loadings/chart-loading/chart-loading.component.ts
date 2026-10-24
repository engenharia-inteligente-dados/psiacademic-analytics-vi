import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'chart-loading',
    templateUrl: './chart-loading.component.html',
    styleUrls: ['./chart-loading.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ChartLoadingComponent implements OnInit {
  @Input() loading = false;
  constructor() { }

  ngOnInit(): void {
  }

}
