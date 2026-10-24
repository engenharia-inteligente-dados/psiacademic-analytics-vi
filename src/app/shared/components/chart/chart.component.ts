import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ChartComponent implements OnInit, OnDestroy {
  @Input() chart: any;
  @Input() id: string | number;
  @Input() classe: string = "relative h-80"

  private ChartContext: any;
  constructor() {}

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    const instanciaChart = Chart.getChart(`chart-${this.id}`);
    Object.keys(Chart.instances).forEach((position: any) => {

      if (Chart.instances[position].canvas.id === `chart-${this.id}`) {
        Chart.instances[position].destroy();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart() {
    try{
      let ctx: any = document.getElementById(
      `chart-${this.id}`
    ) as HTMLCanvasElement;
    ctx = ctx.getContext('2d');
    this.ChartContext = new Chart(ctx, this.chart);
      }
      catch(error){
        console.log(error)
      }
  }
}
