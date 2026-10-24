import { Component, ChangeDetectionStrategy } from '@angular/core';
import brazilGeo from './brazil_geo.json';

@Component({
    selector: 'geo-chart',
    templateUrl: './geo-chart.component.html',
    styleUrls: ['./geo-chart.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class GeoChartComponent {
  
  public legendOptions: object = {
    visible: true,
    mode: 'Default',
    position: 'Left',
    alignment: 'Center',
    textStyle: {
      size: '12px',
    },
    title: {
      description: 'Número de internações',
      text: 'Número de internações'
    },
    titleStyle: {
      size: '13px',
      color: '#666',
      height: 10,
      fontWeight: 'semibold',
    }
  }

  public layerOptions: object[] = [{
    dataLabelSettings: {
      visible: true,
      smartLabelMode: 'Trim'
    },
    tooltipSettings: {
      visible: true,
      valuePath: 'Quantidade'
    },
    shapeData: brazilGeo,
    shapePropertyPath: 'sigla',
    shapeDataPath: 'Estado',
    shapeSettings: {
      colorValuePath: 'Casos',
      colorMapping: [
        { value: 'Faixa 1: 0 - 15.094', color: '#EEEEEE' },
        { value: 'Faixa 2: 15.095 - 30.342', color: '#C5EAFF' },
        { value: 'Faixa 3: 30.343 - 48.475', color: '#50BFFF' },
        { value: 'Faixa 4: 48.476 - 119.753', color: '#0067C6' },
        { value: 'Faixa 5: 119.754 - 602.929', color: '#0018B0' },
      ],
      border: {
        color: '#596580',
        width: 0.5
    },
    },
    dataSource: [
      { Estado: 'AC', Casos: 'Faixa 1: 0 - 15.094', Quantidade: 'AC: 14.849'},
      { Estado: 'AL', Casos: 'Faixa 3: 30.343 - 48.475', Quantidade: 'AL: 40.663' },
      { Estado: 'AP', Casos: 'Faixa 1: 0 - 15.094', Quantidade: 'AP: 874' },
      { Estado: 'AM', Casos: 'Faixa 1: 0 - 15.094', Quantidade: 'AM: 6.697' },
      { Estado: 'BA', Casos: 'Faixa 4: 48.476 - 119.753', Quantidade: 'BA: 55.565' },
      { Estado: 'CE', Casos: 'Faixa 4: 48.476 - 119.753', Quantidade: 'CE: 87.668' },
      { Estado: 'DF', Casos: 'Faixa 3: 30.343 - 48.475', Quantidade: 'DF: 46.348' },
      { Estado: 'ES', Casos: 'Faixa 2: 15.095 - 30.342', Quantidade: 'ES: 26.563' },
      { Estado: 'GO', Casos: 'Faixa 4: 48.476 - 119.753', Quantidade: 'GO: 104.923' },
      { Estado: 'MA', Casos: 'Faixa 4: 48.476 - 119.753', Quantidade: 'MA: 49.893' },
      { Estado: 'MT', Casos: 'Faixa 2: 15.095 - 30.342', Quantidade: 'MT: 21.554' },
      { Estado: 'MS', Casos: 'Faixa 2: 15.095 - 30.342', Quantidade: 'MS: 21.651' },
      { Estado: 'MG', Casos: 'Faixa 5: 119.754 - 602.929', Quantidade: 'MG: 180.415' },
      { Estado: 'PA', Casos: 'Faixa 3: 30.343 - 48.475', Quantidade: 'PA: 34.109' },
      { Estado: 'PB', Casos: 'Faixa 3: 30.343 - 48.475', Quantidade: 'PB: 44.808' },
      { Estado: 'PR', Casos: 'Faixa 5: 119.754 - 602.929', Quantidade: 'PR: 216.656' },
      { Estado: 'PE', Casos: 'Faixa 4: 48.476 - 119.753', Quantidade: 'PE: 65.916' },
      { Estado: 'PI', Casos: 'Faixa 2: 15.095 - 30.342', Quantidade: 'PI: 29.222' },
      { Estado: 'RJ', Casos: 'Faixa 5: 119.754 - 602.929', Quantidade: 'RJ: 123.461' },
      { Estado: 'RN', Casos: 'Faixa 3: 30.343 - 48.475', Quantidade: 'RN: 32.022' },
      { Estado: 'RS', Casos: 'Faixa 5: 119.754 - 602.929', Quantidade: 'RS: 393.845' },
      { Estado: 'RO', Casos: 'Faixa 1: 0 - 15.094', Quantidade: 'RO: 13.318' },
      { Estado: 'RR', Casos: 'Faixa 1: 0 - 15.094', Quantidade: 'RR: 2.535' },
      { Estado: 'SC', Casos: 'Faixa 5: 119.754 - 602.929', Quantidade: 'SC: 147.862' },
      { Estado: 'SP', Casos: 'Faixa 5: 119.754 - 602.929', Quantidade: 'SP: 602.929' },
      { Estado: 'SE', Casos: 'Faixa 2: 15.095 - 30.342', Quantidade: 'SE: 16.075' },
      { Estado: 'TO', Casos: 'Faixa 1: 0 - 15.094', Quantidade: 'TO: 10.394' },
    ]
  }]
}