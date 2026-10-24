import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'dash-loading',
    templateUrl: './dash-loading.component.html',
    styleUrls: ['./dash-loading.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DashboardLoadingComponent implements OnInit {
  @Input() loading:Boolean = false
  constructor() { }

  ngOnInit(): void {
  }

}
