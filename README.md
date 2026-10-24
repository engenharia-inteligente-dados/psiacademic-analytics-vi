# Psiacademic Analytics - Módulo Visualização da Informação
## **Modulo de Visualização de Informação**

Esse projeto tem como objetivo a visualização de informação do Psiacademic Analytics 

## **Estrutura**


## **Implementações Futuras**
 
- [ ] Melhoria em Acessibilidade
- [ ] Dark Mode
- [ ] Internacionalização
### Commits


| Tipo de commit | Descrição                | Release                                                                                                                     |
| -------------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `feat`         | Uma nova feature         |                                                                                                                     |
| `fix`          | Correção de bugs         |                                                                                                                     |
| `docs`         | Documentação             |                                   |
| `lint`        | Formatação de código     | Alterações que não afetam o significado do código (espaços em branco, identação, ponto-e-virgula, etc)                      |
| `style`       | Estilização de Página    | Alterações que afentam estilização da página não necessariamente uma funcionalidade nova (Aquivos styl,css, animações )                      |
| `refactor`     | Refatoração de código    | Alteração no código que não corrige um bug, e nem adiciona uma feature                                                      |
| `perf`         | Melhorias de performance | Alteração no código que melhora a performance                                                                               |
| `build`        | Builds                   | Alterações que afetam o sistema de build, ou dependências externas (escopos exemplares: gulp, broccoli, yarn, npm, webpack) |
| `ci`           | Integração continua (CI) | Alteração aos arquivos de configuração e scripts do CI (escopos exemplares: travis, circleci, browserstack, saucelabs)      |
| `chore`        | Chores                   | Outras mudanças que não modificam os arquivos da aplicação ou dos testes                                                    |
| `revert`       | Reversão de commit       | Reversão a um commit anterior          
### **Libs**

Libs padrão angular não serão adicionadas nessa listagem
* [Angular](https://angular.dev/) `22.2`
* [tailwindcss](https://tailwindcss.com/) `3.4`
* [Chartjs](https://www.chartjs.org/) `4.6`
* [Syncfusion Maps](https://ej2.syncfusion.com/angular/documentation/maps/getting-started) `23.2` (mantida na v23: a chave de licença em `main.ts` é desta versão)
* [popperjs/core](https://popper.js.org/) `2.11.8`
* [sweetAlert2](https://sweetalert2.github.io/) `11.26`
## **Comandos**

### **Angular**
Comandos do angular
### **Run**
 Requer Node.js `24.x` (definido em `engines` no `package.json`). Instale as dependências com `npm ci`.

 Para desenvolvimento use `npm run dev` (ou `ng s -o`) para abrir o servidor na porta `http://localhost:4200/`.

 `npm start` roda o servidor de produção (`server.js`, Express), que serve o build em `dist/` — rode `npm run build` antes.

### **Gerar artefatos angular**
 User o `ng g c nome-do-component` para gerar um um novo componente ou use 
 `ng g directive|pipe|service|class|guard|interface|enum|module` para gerar outros artefatos angular;

 ### **Build**

 Use `ng build` para gerar build de produção
 
 ### **Testes**
 Para testar use `ng test` para realizar testes unitarios  ou `ng e2e` para teste end-to-end

## **Deploy (Heroku)**

 O app roda no Heroku com o buildpack Node.js (stack `heroku-24`):

 1. O Heroku instala as dependências com `npm ci` a partir do `package-lock.json` (mantenha-o commitado).
 2. Roda `npm run build` (`ng build`, configuração de produção) automaticamente.
 3. Sobe o processo `web: node server.js` definido no `Procfile`, escutando a porta `$PORT`.

 Para publicar, conecte o app ao repositório GitHub (Dashboard do Heroku → Deploy → GitHub) ou use a CLI:

 ```bash
 heroku create <nome-do-app>
 git push heroku main
 ```


## Project References
 Utilizando como base UI Kit desenvolvido por <a href="https://creative-tim.com/" target="_blank">Creative Tim </a>.
 