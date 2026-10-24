import { ChangeDetectorRef, Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  TOTAL_ANOS_POR_REP_CHART,
  TOTAL_TRABALHOS_ANOS,
  TOTAL_TRABALHOS_REP_CHART,
} from 'src/app/shared/const/chart.const';
import { ListasProvider } from 'src/app/shared/providers/listas.provider';
import { AnalyticsAPIService } from '../analytics-api.service';
import {
  formatChartData,
  formtData,
  replaceStringIndex,
} from '../../../shared/utils/formtUtil';
import { IChart } from '../../../shared/interfaces/chart.interface';
import { Colors } from 'src/app/shared/enums/Colors';
import { UserFeedbackProvider } from '../../../shared/providers/users-feedback.provider';
import { FREQUENCIAS } from './frequencia.const';
import { DashboardElementsName } from './dashboardElementsNames.enum';
import { TRANSTORNOS_REPOSITORIO_ANO } from '../../../shared/const/chart.const';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DashboardComponent implements OnInit {
  public loading = false;
  public Charts: { [key: string]: IChart } = {};
  public Frequencias: { [key: string]: any } = {};
  public DashElem = DashboardElementsName;
  public readonly atributosTabelas = [
    { label: 'Termo', key: 'termo', primeiro: true },
    { label: 'Frequência', key: 'total' },
  ];
  public showModalFrequencia: boolean = false;
  public frequenciaSelecionada: any = {};
  constructor(
    private analyticsApi: AnalyticsAPIService,
    private listasProvider: ListasProvider,
    private def: ChangeDetectorRef,
    private feedback: UserFeedbackProvider
  ) {}

  ngOnInit(): void {
    this.getDefaultCharts();
    this.getListas();
  }
  ngOnDestroy(): void {
    this.Charts = {};
  }

  async qtdTranstornosRepositorioAno() {
    const chart = structuredClone(TRANSTORNOS_REPOSITORIO_ANO);
    try {
      const { repositorios, anos } = await this.listasProvider.getListas();
      const filterObj = {
        rep: {
          arr: repositorios,
          first: repositorios[0],
        },
        ano: {
          arr: anos,
          first: anos[0],
        },
      };
      await Object.keys(filterObj).forEach((value, index) => {
        chart.Actions.Filters[index].Value = filterObj[value].first;
        chart.Actions.Filters[index].Options = filterObj[value].arr;
      });
      let params = this.ajustParam(chart.Actions.Filters)
      const resp = await this.analyticsApi.getChartFiltrado(chart.Url,params);
      const { labels, dataset } = formatChartData(resp, chart.Keys, chart.DatasetConfig);
      chart.Title = chart.Title.replace('{0}', filterObj.rep.first).replace(
        '{1}',
        filterObj.ano.first
      );

      chart.Chart.data.labels = labels;
      dataset.label ="Transtorno"
      chart.Chart.data.datasets.push(dataset);
      this.Charts[this.DashElem.TranstornosRepositorioAno] = { ...chart };
    } catch (error: any) {
      this.feedback.error(error);
    }
  }

  async qtdTrabalhosEmAnosPorRepositorio() {
    const chart = structuredClone(TOTAL_ANOS_POR_REP_CHART);
    try {
      const { repositorios } = await this.listasProvider.getListas();
      const rep = repositorios[0];
      chart.Actions.Filters[0].Value = rep;
      chart.Actions.Filters[0].Options = repositorios;
      const resp = await this.analyticsApi.getChartFiltrado(chart.Url,{...this.ajustParam(chart.Actions.Filters)});
      const {labels,dataset} = formatChartData(resp, chart.Keys);
      chart.Title = chart.Title.replace('{0}', rep);
      dataset.label ="Quantidade"
      chart.Chart.data.datasets.push(dataset);
      this.Charts[this.DashElem.TrabalhosEmAnosPorRepositorio] = { ...chart };
    } catch (error: any) {
      this.feedback.error(error);
    }
  }

  async totalTrabalhosPorRepositorios() {
    const chart = structuredClone(TOTAL_TRABALHOS_REP_CHART);
    try {
      const resp = await this.analyticsApi.getRepositorios();
      const { labels, dataset } = formatChartData(resp, chart.Keys, chart.DatasetConfig);
      chart.Chart.data.labels = labels;
      dataset.label ="Quantidade"
      chart.Chart.data.datasets.push(dataset);
      this.Charts[this.DashElem.TrabalhosPorRepositorios] = { ...chart };
    } catch (error: any) {
      this.feedback.error(error);
    }
  }

  async totalAnos() {
    const chart = structuredClone(TOTAL_TRABALHOS_ANOS);
    try {
      const resp = await this.analyticsApi.getAnos();
      const { labels, values } = formatChartData(resp, chart.Keys);
      chart.Chart.data.labels = labels;
      chart.Chart.data.datasets.push({
        data: values,
        fill: false,
        backgroundColor: Colors.Blue_Ardosia,
        borderColor: Colors.Blue_Ardosia,
        barThickness: 20,
        label: `Quantidade`,
      });
      this.Charts[this.DashElem.TotalAnos] = { ...chart };
    } catch (error) {
      this.feedback.error(error);
    }
  }

  public async getDefaultCharts() {
    this.loading = true;
    try {
      Promise.allSettled([
        await this.qtdTrabalhosEmAnosPorRepositorio(),
        await this.totalTrabalhosPorRepositorios(),
        await this.totalAnos(),
        await this.qtdTranstornosRepositorioAno(),
      ]).catch((err) => {
        console.error(err);
      });
    } catch (error) {
      this.feedback.error(error);
    } finally {
      this.def.detectChanges();
      this.loading = false;
    }
  }

  public async frequenciaTiposTrabalhos() {
    this.Frequencias[this.DashElem.FrequenciasTiposTrabalhos] = structuredClone(
      FREQUENCIAS[this.DashElem.FrequenciasTiposTrabalhos]
    );
    this.Frequencias[this.DashElem.FrequenciasTiposTrabalhos].Loading = true;
    try {
      const frequencia = await FREQUENCIAS[
        this.DashElem.FrequenciasTiposTrabalhos
      ].Frequencias;
      this.Frequencias[this.DashElem.FrequenciasTiposTrabalhos].Frequencias =
        frequencia;
      this.Frequencias[this.DashElem.FrequenciasTiposTrabalhos].Preview =
        frequencia.slice(0, 5);
    } catch (error) {
      this.feedback.error(error);
    } finally {
      this.Frequencias[this.DashElem.FrequenciasTiposTrabalhos].Loading = false;
    }
  }

  public async frequenciaTitulosTrabalhos() {
    this.Frequencias[this.DashElem.FrequenciasTitulosTrabalhos] =
      structuredClone(FREQUENCIAS[this.DashElem.FrequenciasTitulosTrabalhos]);
    this.Frequencias[this.DashElem.FrequenciasTitulosTrabalhos].loading = true;
    try {
      const frequencia = await FREQUENCIAS[
        this.DashElem.FrequenciasTitulosTrabalhos
      ].Frequencias;
      this.Frequencias[this.DashElem.FrequenciasTitulosTrabalhos].Frequencias =
        frequencia;
      this.Frequencias[this.DashElem.FrequenciasTitulosTrabalhos].Preview =
        frequencia.slice(0, 5);
    } catch (error) {
      this.feedback.error(error);
    } finally {
      this.Frequencias[this.DashElem.FrequenciasTitulosTrabalhos].loading =
        false;
    }
  }

  getListas() {
    this.frequenciaTiposTrabalhos();
    this.frequenciaTitulosTrabalhos();
  }

  private ajustParam(filters,newValues?){
    const params = {}
    filters.forEach(filter => {
      if(filter.Label === newValues?.label){
        params[filter.Key] = newValues?.newValue
      }
      else{
        params[filter.Key] = filter.Value ;
      }
    });
    return params
  }

  async filter(event, chart: IChart, propertyName: string, index: number) {
    const { newValue,label } = event;
    const { Url } = chart;
    const params = this.ajustParam(chart.Actions.Filters,{newValue,label})
    this.Charts[propertyName].Loading = true;
    try {
      const resp = await this.analyticsApi.getChartFiltrado(Url, params)
      const Actions = chart.Actions;
      const { labels, dataset } = formatChartData(resp, chart.Keys, chart?.DatasetConfig);
      if(chart?.DatasetConfig?.replaceTitle){
        chart.Title = chart.Title.replace(Actions.Filters[index].Value, newValue);
      }
      Actions.Filters[index].Value = newValue;
      chart.Chart.data.datasets[0] = dataset;
      if(chart.DatasetConfig?.multipleDataset){
        chart.Chart.data.datasets = dataset;
      }
      chart.Chart.data.labels = labels;
      chart.Actions = Actions;
      this.Charts[propertyName] = { ...chart };
    } catch (error) {
      this.feedback.error(error);
    } finally {
      this.Charts[propertyName].Loading = false;
    }
  }

  openModal(frequencia: any) {
    this.showModalFrequencia = !this.showModalFrequencia;
    this.frequenciaSelecionada = frequencia;
  }
  closeModal() {
    this.showModalFrequencia = !this.showModalFrequencia;
    this.frequenciaSelecionada = null;
  }
}
