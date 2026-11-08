import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import * as echarts from 'echarts/core';
import { MapChart } from 'echarts/charts';
import { TooltipComponent } from 'echarts/components';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import brazilGeo from './brazil_geo.json';

// LabelLayout precisa ser registrado: sem ele o build descarta o labelLayout da série
echarts.use([MapChart, TooltipComponent, LabelLayout, CanvasRenderer]);
echarts.registerMap('brasil', brazilGeo as any);

// Mesma fonte que o mapa usava com o Syncfusion (Roboto é carregada no index.html)
const FONTE = 'Roboto, Noto, sans-serif';
const RAD = Math.PI / 180;

// Projeção de Mercator, a mesma do mapa anterior
const MERCATOR = {
  project: ([lon, lat]: number[]) => [lon, -Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2)) / RAD],
  unproject: ([x, y]: number[]) => [x, (2 * Math.atan(Math.exp(-y * RAD)) - Math.PI / 2) / RAD],
};

interface Faixa {
  rotulo: string;
  cor: string;
}

interface CasosEstado {
  Estado: string;
  Faixa: number;
  Quantidade: string;
}

@Component({
    selector: 'geo-chart',
    templateUrl: './geo-chart.component.html',
    styleUrls: ['./geo-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GeoChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapa', { static: true }) mapa: ElementRef<HTMLDivElement>;

  public titulo = 'Número de internações';

  public faixas: Faixa[] = [
    { rotulo: 'Faixa 1: 0 - 15.094', cor: '#EEEEEE' },
    { rotulo: 'Faixa 2: 15.095 - 30.342', cor: '#C5EAFF' },
    { rotulo: 'Faixa 3: 30.343 - 48.475', cor: '#50BFFF' },
    { rotulo: 'Faixa 4: 48.476 - 119.753', cor: '#0067C6' },
    { rotulo: 'Faixa 5: 119.754 - 602.929', cor: '#0018B0' },
  ];

  public dataSource: CasosEstado[] = [
    { Estado: 'AC', Faixa: 0, Quantidade: '14.849' },
    { Estado: 'AL', Faixa: 2, Quantidade: '40.663' },
    { Estado: 'AP', Faixa: 0, Quantidade: '874' },
    { Estado: 'AM', Faixa: 0, Quantidade: '6.697' },
    { Estado: 'BA', Faixa: 3, Quantidade: '55.565' },
    { Estado: 'CE', Faixa: 3, Quantidade: '87.668' },
    { Estado: 'DF', Faixa: 2, Quantidade: '46.348' },
    { Estado: 'ES', Faixa: 1, Quantidade: '26.563' },
    { Estado: 'GO', Faixa: 3, Quantidade: '104.923' },
    { Estado: 'MA', Faixa: 3, Quantidade: '49.893' },
    { Estado: 'MT', Faixa: 1, Quantidade: '21.554' },
    { Estado: 'MS', Faixa: 1, Quantidade: '21.651' },
    { Estado: 'MG', Faixa: 4, Quantidade: '180.415' },
    { Estado: 'PA', Faixa: 2, Quantidade: '34.109' },
    { Estado: 'PB', Faixa: 2, Quantidade: '44.808' },
    { Estado: 'PR', Faixa: 4, Quantidade: '216.656' },
    { Estado: 'PE', Faixa: 3, Quantidade: '65.916' },
    { Estado: 'PI', Faixa: 1, Quantidade: '29.222' },
    { Estado: 'RJ', Faixa: 4, Quantidade: '123.461' },
    { Estado: 'RN', Faixa: 2, Quantidade: '32.022' },
    { Estado: 'RS', Faixa: 4, Quantidade: '393.845' },
    { Estado: 'RO', Faixa: 0, Quantidade: '13.318' },
    { Estado: 'RR', Faixa: 0, Quantidade: '2.535' },
    { Estado: 'SC', Faixa: 4, Quantidade: '147.862' },
    { Estado: 'SP', Faixa: 4, Quantidade: '602.929' },
    { Estado: 'SE', Faixa: 1, Quantidade: '16.075' },
    { Estado: 'TO', Faixa: 0, Quantidade: '10.394' },
  ];

  private chart: echarts.ECharts;
  private resizeObserver: ResizeObserver;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    // Fora da zona do Angular: eventos de mouse do mapa não precisam disparar detecção de mudanças
    this.zone.runOutsideAngular(() => {
      this.chart = echarts.init(this.mapa.nativeElement);
      this.chart.setOption(this.opcoes());
      this.resizeObserver = new ResizeObserver(() => this.chart.resize());
      this.resizeObserver.observe(this.mapa.nativeElement);
    });
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.chart?.dispose();
  }

  private opcoes(): echarts.EChartsCoreOption {
    return {
      textStyle: { fontFamily: FONTE },
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        borderWidth: 0,
        padding: [5, 8],
        textStyle: { color: '#FFFFFF', fontSize: 12, fontFamily: FONTE },
        extraCssText: 'border-radius: 4px; box-shadow: none;',
        // Acima do cursor, centralizado, como no mapa anterior
        position: (ponto, _params, _dom, _rect, tamanho) => [
          ponto[0] - tamanho.contentSize[0] / 2,
          ponto[1] - tamanho.contentSize[1] - 12,
        ],
        formatter: ({ name, data }) => `${name}: ${(data as { quantidade: string }).quantidade}`,
      },
      series: [{
        type: 'map',
        map: 'brasil',
        nameProperty: 'sigla',
        projection: MERCATOR,
        roam: false,
        selectedMode: false,
        // Espaço à esquerda reservado para a legenda
        left: 205,
        right: 8,
        top: 0,
        bottom: 0,
        // Sem isto o ECharts 6 estica o mapa para preencher a caixa inteira
        preserveAspect: 'contain',
        itemStyle: { borderColor: '#596580', borderWidth: 0.5 },
        label: { show: true, color: '#000000', fontSize: 12, fontFamily: FONTE },
        emphasis: { disabled: true },
        // Esconde a sigla que não cabe na largura do estado ou que encobre outra
        labelLayout: ({ rect, labelRect }) => ({ hide: labelRect.width > rect.width, hideOverlap: true }),
        data: this.dataSource.map((estado) => ({
          name: estado.Estado,
          quantidade: estado.Quantidade,
          itemStyle: { areaColor: this.faixas[estado.Faixa].cor },
        })),
      }],
    };
  }
}
