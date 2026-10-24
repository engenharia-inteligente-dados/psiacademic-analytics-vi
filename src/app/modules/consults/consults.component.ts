import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConsultTitle, ConsultaType, ConsultTypeSelectOPtions } from 'src/app/shared/enums/types.enums';
import { IOptionsSelectConsulta } from 'src/app/shared/interfaces/opcoes-select-consultas.interface';
import { IPagination } from 'src/app/shared/interfaces/pagination.interface';
import { ListasProvider } from 'src/app/shared/providers/listas.provider';
import { ConsultsApiService } from './consults-api.service';
import { ITrabalho } from '../../shared/interfaces/trabalhos.interface';
import { UserFeedbackProvider } from '../../shared/providers/users-feedback.provider';

@Component({
    selector: 'app-consults',
    templateUrl: './consults.component.html',
    styleUrls: ['./consults.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ConsultsComponent implements OnInit {
  private readonly genericTitle = 'Consultar Artigos Por {0}';
  private readonly avancadaTitle = 'Avançada';
  public Title: string;
  public options:IOptionsSelectConsulta = {
    [ConsultTypeSelectOPtions.transtornosOptions]: [],
    [ConsultTypeSelectOPtions.anosOptions]:[],
    [ConsultTypeSelectOPtions.repositoriosOptions]:[]
  };

  public trabalhos: any[];
  public tipo: ConsultaType;
  public loading: boolean;
  public loadingTable: boolean;

  public form: any = {};
  public paginacao: IPagination = { limite: 10, pagina: 1, total: 0 };
  private _controleNovaPesquisa = false;
  public showModal = false;
  public trabalho: ITrabalho;
  public readonly atributosTabela = [
    { label: 'Título', key: 'titulo', primeiro: true },
    { label: 'Autores', key: 'autores' },
    { label: 'Repositório', key: 'repositorio' },
    { label: 'Tipo do Trabalho', key: 'tipo' },
    {
      label: 'Ações',
      key: 'actions',
      acoes: [
        {
          label: 'Detalhes do trabalho',
          icon: 'fas fa-info-circle',
          classIcon: 'hover:text-sky-700 text-sky-400',
          id: 1,
        },
        {
          label: 'Abrir Referencia do trabalho',
          icon: 'fas fa-external-link',
          classIcon: 'hover:text-sky-700 text-sky-400',
          id: 2,
        },
      ],
    },
  ];
  constructor(
    private route: ActivatedRoute,
    private consultApi: ConsultsApiService,
    private listasProvider: ListasProvider,
    private userFeedback:UserFeedbackProvider
  ) {
    this.route.params.subscribe((params) => {
      this.tipo = params.tipo;
      this.reset();
      this.trataTitle();
    });
    this.getListas();
  }

  ngOnInit(): void {}

  async getListas() {
    try {
      this.loading = true;
      const { anos, repositorios,transtornos } = await this.listasProvider.getListas();
      this.options.anosOptions = [];
      this.options.repositoriosOptions = [];
      this.options.anosOptions = anos;
      this.options.repositoriosOptions = repositorios;
      this.options.transtornosOptions = transtornos
    } catch (error:any) {
      this.userFeedback.error(error,`Erro`);
    } finally {
      this.loading = false;
    }
  }

  async pesquisar() {
    const param = this.form;
    if (this._controleNovaPesquisa) {
      return;
    }
    this._controleNovaPesquisa = true;
    param['pagina'] = this.paginacao.pagina;
    param[`limite`] = this.paginacao.limite;
    try {
      this.loadingTable = true;
      const resp = await this.consultApi.consulta(param, this.tipo);
      if(!!!resp){
        this.userFeedback.infor("Não Foram encontrados trabalhos","Resultado");
      }
      this.trabalhos = resp?.trabalhos;
      this.paginacao = resp?.paginacao;
    } catch (error:any) {
       this.userFeedback.error(error,`Erro`);
       this.loadingTable = false;
    } finally {
      this._controleNovaPesquisa = false;
      this.loadingTable = false;
    }
  }

  recivieForm(form: any) {
    this.reset();
    this.form = form;
    this.pesquisar();
  }

  requestMore(event) {
    this.paginacao = { ...event };
    this.pesquisar();
  }

  trataEvento({ acao, linha }) {
    switch (acao) {
      case 1:
        this.openModal(linha);
        break;
      case 2:
        this.openUrl(linha);
        break;
    }
  }

  openUrl(linha: any) {
    const { url } = linha;
    window.open(url, '_blank');
  }

  openModal(trabalho: ITrabalho) {
    this.showModal = !this.showModal;
    this.trabalho = trabalho;
  }

  closeModal(close: boolean) {
    this.showModal = !this.showModal;
    this.trabalho = null;
  }
  private trataTitle() {
    if (this.tipo === ConsultaType.Avancada) {
      this.Title = this.avancadaTitle;
    } else {
      this.Title = this.genericTitle.replace('{0}', ConsultTitle[this.tipo]);
    }
  }

  private reset() {
    this.form = {};
    this.trabalhos = [];
    this.paginacao = { limite: 10, pagina: 1, total: 0 };
  }
}
