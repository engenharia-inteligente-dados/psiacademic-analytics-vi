import { ConsultaType } from 'src/app/shared/enums/types.enums';
export const TEXTOS = {
  Title: 'Saúde Mental Analytics',
};

export const MAIN_ROUTES = [
  {
    Icon: 'fas fa-chart-line',
    Route: 'analytics',
    Label: 'Dashboard',
    Hash:'#menuAnalytics',
    InUse: true,
    SubRoutes: [
      {
        Label: 'Repositórios',
        Route: [`analytics/dashboard/`],
        InUse: true,
        Icon: `fas fa-chart-line`,
        Hash:'#menuDashboardRepositorios',
      },
      {
        Label: 'Dados Públicos',
        Route: [`saude-publica/dashboard/`],
        InUse: true,
        Icon: `fas fa-chart-pie`,
        Hash:'#menuDashboardDadosPublicos',
      },
    ],
  },
  {
    Icon: 'fas fa-search',
    Route: 'consultas/anos',
    Label: 'Consultas',
    Hash:'#menuConsultas',
    SubRoutes: [
      {
        Label: 'Por Ano',
        Route: [`consultas/${ConsultaType.Anos}/`],
        InUse: true,
        Icon: `fas fa-calendar`,
        Hash:'#menuConsultasAno',

      },
      {
        Label: 'Por Expressão',
        Route: [`consultas/${ConsultaType.Expressoes}/`],
        InUse: true,
        Icon: `fas fa-comment-dots`,
        Hash:'#menuConsultasExpressao',

      },
      {
        Label: 'Por Repositório',
        Route: [`consultas/${ConsultaType.Repositorios}`],
        InUse: true,
        Icon: `fas fa-university`,
        Hash:'#menuConsultasRepositorio',

      },
      {
        Label: 'Por Transtornos',
        Route: [`consultas/${ConsultaType.Transtornos}/`],
        InUse: true,
        Icon: `fas fa-brain`,
        Hash:'#menuConsultasTranstorno',

      },
      {
        Label: 'Avançada',
        Route: [`consultas/${ConsultaType.Avancada}/`],
        InUse: true,
        Icon: `fas fa-search-plus`,
        Hash:'#menuConsultasAvancada',
      },
    ],
    InUse: true,
  },
];
