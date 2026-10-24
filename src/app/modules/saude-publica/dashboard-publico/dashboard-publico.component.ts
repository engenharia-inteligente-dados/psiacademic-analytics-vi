import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { IChart } from '../../../shared/interfaces/chart.interface';
import { Colors } from 'src/app/shared/enums/Colors';
import {
  formatChartData,
  formatChartDataPie,
  formtData,
  replaceStringIndex,
} from '../../../shared/utils/formtUtil';
import { UserFeedbackProvider } from '../../../shared/providers/users-feedback.provider';
import { DashboardPublicoElementsName } from './dashboard-publicoElementsName.enum';
import { SaudePublicaAPIService } from '../saude-publica-api.service';
import { ListasProvider } from 'src/app/shared/providers/listas.provider';
import { CASOS_MORBIDADE_ATENDIMENTO, CASOS_POR_ESTADO, DADOS_CONTEUDO } from 'src/app/shared/const/chart.const';
import { DADOS_POR_CONTEUDO_ATENDIMENTO, DADOS_POR_CONTEUDO_MORBIDADE, NUMERO_ATENDIMENTO_ANO, NUMERO_CASO_ESTADO_DATASUS, NUMERO_CASO_ESTADO_SISAB, NUMERO_CASO_MORBIDADE_ANO } from '../../analytics/analytics.urls';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Action } from 'rxjs/internal/scheduler/Action';

@Component({
    selector: 'app-dashboard-publico',
    templateUrl: './dashboard-publico.component.html',
    styleUrls: ['./dashboard-publico.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DashboardPublicoComponent implements OnInit {
  public loading = false;
  public Charts: { [key: string]: IChart } = {};
  public DashPubElem = DashboardPublicoElementsName;


  constructor(
    private saudePublicaApi: SaudePublicaAPIService,
    private def: ChangeDetectorRef,
    private feedback: UserFeedbackProvider,
    private ListasProvider: ListasProvider,
  ) { }

  ngOnInit(): void {
    this.getDefaultCharts();
  }

  ngOnDestroy(): void {
    this.Charts = {};
  }

  async qtdCasosPorEstado() {
    const chart = structuredClone(CASOS_POR_ESTADO);
    try {
      const { conteudo, anos } = this.ListasProvider.getListasP();
      const filterObj = {
        conteudos: {
          arr: conteudo,
          first: conteudo[0],
        },
        anos: {
          arr: anos,
          first: anos[0],
        },
      };

      await Object.keys(filterObj).forEach((value, index) => {
        chart.Actions.Filters[index].Value = filterObj[value].first;
        chart.Actions.Filters[index].Options = filterObj[value].arr;
      });
      let resp = await this.saudePublicaApi.getChartFiltrado_P(chart.Url);
      resp = resp.filter((item) => {
        return item.ano == anos[0];
      })
      const { labels, dataset } = formatChartData(resp, chart.Keys, chart.DatasetConfig);
      chart.Chart.data.labels = labels;
      dataset.label = "Casos"
      chart.Chart.data.datasets.push(dataset);
      this.Charts[this.DashPubElem.qtdCasosPorEstado] = { ...chart };
    } catch (error: any) {
      this.feedback.error(error);
      console.log(error)
    }
  }

  async qtdCasosPorEstadoEvent(event?: any, changedChart?: IChart) {
    const chart = changedChart
    this.Charts[this.DashPubElem.qtdCasosPorEstado].Loading = true
    try {
      if(event.label === 'Ano'){
        chart.Actions.Filters[1].Value = event.newValue;
      }
      if (event.newValue === 'Internações') {
        chart.Url = NUMERO_CASO_ESTADO_DATASUS;
        chart.Keys = { labelName: 'siglaestado', valueName: 'total_casos', dinamic: true };
      }
      if (event.newValue === 'Atenção básica') {
        chart.Url = NUMERO_CASO_ESTADO_SISAB;
        chart.Keys = { labelName: 'siglaestado', valueName: 'total_atendimentos', dinamic: true };
      }
      let resp = await this.saudePublicaApi.getChartFiltrado_P(chart.Url);
      resp = resp.filter((item) => {
        if (event.label === 'Ano') {
          return item.ano == event.newValue;
        }
        else {
          return item.ano == chart.Actions.Filters[1].Value
        }
      })
      const { labels, dataset } = formatChartData(resp, chart.Keys, chart.DatasetConfig);
      chart.Chart.data.labels = labels;
      dataset.label = "Casos"
      chart.Chart.data.datasets[0] = dataset;
      this.Charts[this.DashPubElem.qtdCasosPorEstado] = { ...chart };
      this.Charts[this.DashPubElem.qtdCasosPorEstado].Loading = false
      this.def.detectChanges()
    } catch (error: any) {
      this.feedback.error(error);
      console.log(error)
    }
    this.def.detectChanges()
  }

  async qtdCasosPorMorbidadeAtendimento() {
    const chart = structuredClone(CASOS_MORBIDADE_ATENDIMENTO);
    try {
      const { conteudo, estado, morbidades, tipoAtendimento } = this.ListasProvider.getListasP();
      const filterObj = {
        conteudos: {
          arr: conteudo,
          first: conteudo[0],
          Key: 'conteudo'
        },
        estados: {
          arr: estado,
          first: estado[0],
          Key: 'estado'
        },
        morbidade: {
          arr: morbidades,
          first: morbidades[0],
          Key: 'morbidade'
        },
        tipoDeAtendimento: {
          arr: tipoAtendimento,
          first: tipoAtendimento[0],
          Key: 'tipo_atendimento'
        },
      };
      await Object.keys(filterObj).forEach((value, index) => {
        chart.Actions.Filters[index].Value = filterObj[value].first;
        chart.Actions.Filters[index].Options = filterObj[value].arr;
      });
      let resp = await this.saudePublicaApi.getChartFiltrado_P(chart.Url);
      resp = resp.filter(item => {
        return item.estado.toLowerCase() === filterObj.estados.first.toLowerCase()
          && item.morbidade.toLowerCase() === filterObj.morbidade.first.toLowerCase()
      });
      const { labels, dataset } = formatChartData(resp, chart.Keys, chart.DatasetConfig);
      chart.Chart.data.labels = labels;
      dataset.label = "Casos"
      chart.Chart.data.datasets.push(dataset);
      this.Charts[this.DashPubElem.qtdCasosPorMorbidadeAtendimento] = { ...chart };
    } catch (error: any) {
      this.feedback.error(error);
      console.log(error)
    }
  }

  async qtdCasosPorMorbidadeAtendimentoEvent(event?: any, changedChart?: IChart) {
    const chart = changedChart
    this.Charts[this.DashPubElem.qtdCasosPorMorbidadeAtendimento].Loading = true
    const { conteudo, estado, morbidades, tipoAtendimento } = this.ListasProvider.getListasP();

    chart.Actions.Filters.forEach((item) => {
      if (item.Label.toLowerCase() === event.label.toLowerCase()) {
        item.Value = event.newValue
      }
    });

    try {
      if (chart.Actions.Filters[0].Value === 'Internações' ||event.newValue === 'Internações') {
        chart.Url = NUMERO_CASO_MORBIDADE_ANO;
        chart.Keys = { labelName: 'ano', valueName: 'total_casos', dinamic: true };
      }
      if (chart.Actions.Filters[0].Value === 'Atenção básica' || event.newValue === 'Atenção básica') {
        chart.Url = NUMERO_ATENDIMENTO_ANO;
        chart.Keys = {
          labelName: 'ano', valueName: 'total_consultas_no_dia', dinamic: true };
        if (chart.Actions.Filters[3].Value === 'Consulta agendada'){
          chart.Keys.valueName = 'total_consultas_agendadas'
        }
        if (chart.Actions.Filters[3].Value === 'Atendimento de urgência'){
          chart.Keys.valueName = 'total_atendimentos_urgencia'
        }
      }

      let resp = await this.saudePublicaApi.getChartFiltrado_P(chart.Url);
      let filtrados = [...resp]
      if (chart.Actions.Filters[0].Value === 'Internações') {
        for (const filtro of chart.Actions.Filters) {
          if (filtro.Key !== 'conteudo' && filtro.Key !== 'tipo_atendimento') {
            filtrados = filtrados.filter((item) => {
              return item[filtro.Key]?.toLowerCase() === (filtro.Value?.toLowerCase())
            })
          }
        }
      }
      console.log("value", chart.Actions.Filters[0].Value)
      if (chart.Actions.Filters[0].Value === 'Atenção básica') {
        console.log("bananas")
        for (const filtro of chart.Actions.Filters) {
          if (filtro.Key !== 'conteudo' && filtro.Key !== 'morbidade' && filtro.Key !== 'tipo_atendimento') {
            filtrados = filtrados.filter((item) => {
              return item[filtro.Key]?.toLowerCase() === (filtro.Value?.toLowerCase())
            })
            console.log("filtrados if", filtrados)
          }
        }
      }

      chart.Actions.Filters.forEach(filter => {
        if(event.newValue === 'Atenção básica'){
          if(['tipo_atendimento', 'conteudo', 'estado'].includes(filter.Key))
            filter.Visible = true
          else
            filter.Visible = false
        }
        if(event.newValue === 'Internações'){
          if(['morbidade', 'conteudo', 'estado'].includes(filter.Key))
            filter.Visible = true
            else
              filter.Visible = false
        }
      });
      const { labels, dataset } = formatChartData(filtrados, chart.Keys, chart.DatasetConfig);
      chart.Chart.data.labels = labels;
      dataset.label = "Casos"
      chart.Chart.data.datasets[0] = dataset;
      console.log("DATASETT", dataset)
      this.Charts[this.DashPubElem.qtdCasosPorMorbidadeAtendimento] = { ...chart };
      this.Charts[this.DashPubElem.qtdCasosPorMorbidadeAtendimento].Loading = false
      this.def.detectChanges()
      console.log(dataset)
    } catch (error: any) {
      this.feedback.error(error);
      console.log(error)
    }
    this.def.detectChanges()
  }

  async dadosPorConteudo() {
    console.log("CHART", DADOS_CONTEUDO)
    const chart = (DADOS_CONTEUDO);
    try {
      const { conteudo } = this.ListasProvider.getListasP();
      const filterObj = {
        conteudos: {
          arr: conteudo,
          first: conteudo[0],
        },
      };

      await Object.keys(filterObj).forEach((value, index) => {
        chart.Actions.Filters[index].Value = filterObj[value].first;
        chart.Actions.Filters[index].Options = filterObj[value].arr;
      });
      let resp = await this.saudePublicaApi.getChartFiltrado_P(chart.Url);
      resp = resp.filter((item) => {
        return item.conteudos == conteudo[0];
      })
      const { labels, datasetpie } = formatChartDataPie(resp, chart.Keys, chart.DatasetConfig);
      chart.Chart.data.labels = labels;
      datasetpie.label = "Casos"
      chart.Chart.data.datasets.push(datasetpie);
      this.Charts[this.DashPubElem.dadosPorConteudo] = { ...chart };
      //console.log("FINAL", this.Charts[this.DashPubElem.dadosPorConteudo])
    } catch (error: any) {
      this.feedback.error(error);
      console.log(error)
    }
  }

  async dadosPorConteudoEvent(event?: any, changedChart?: IChart) {
    const chart = changedChart
    this.Charts[this.DashPubElem.dadosPorConteudo].Loading = true
    try {
      if (event.newValue === 'Internações') {
        chart.Url = DADOS_POR_CONTEUDO_MORBIDADE;
        chart.Keys = { labelName: 'morbidade', valueName: 'total_casos', dinamic: true };
      }
      if (event.newValue === 'Atenção básica') {
        chart.Url = DADOS_POR_CONTEUDO_ATENDIMENTO;
        chart.Keys = { labelName: 'tipo_atendimento', valueName: 'total_casos', dinamic: true };
      }
      let resp = await this.saudePublicaApi.getChartFiltrado_P(chart.Url);
      resp = resp.filter((item) => {
        if (event.label === 'Conteúdo') {
          return item.conteudos == event.newValue;
        }
        else {
          return item.conteudos == chart.Actions.Filters[1].Value
        }
      })
      const { labels, datasetpie } = formatChartDataPie(resp, chart.Keys, chart.DatasetConfig);
      chart.Chart.data.labels = labels;
      datasetpie.label = "Casos"
      chart.Chart.data.datasets[0] = datasetpie;
      this.Charts[this.DashPubElem.dadosPorConteudo] = { ...chart };
      this.Charts[this.DashPubElem.dadosPorConteudo].Loading = false
      this.def.detectChanges()
    } catch (error: any) {
      this.feedback.error(error);
      console.log(error)
    }
    this.def.detectChanges()
  }

  public async getDefaultCharts() {
    this.loading = true;
    try {
      await Promise.allSettled([
        this.qtdCasosPorEstado(),
        this.qtdCasosPorMorbidadeAtendimento(),
        this.dadosPorConteudo()
      ]);
    } catch (error) {
      this.feedback.error(error);
    } finally {
      this.def.detectChanges();
      this.loading = false;
    }
  }

  private ajustParam(filters, newValues?) {
    const params = {}
    filters.forEach(filter => {
      if (filter.Label === newValues?.label) {
        params[filter.Key] = newValues?.newValue
      }
      else {
        params[filter.Key] = filter.Value;
      }
    });
    return params
  }
}
