import { AfterViewInit, Component, ChangeDetectionStrategy } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class AppComponent implements AfterViewInit {
  title = 'Psiacademic Analytics VI';
  constructor() {
    this.mostrarVersao();
  }


  ngAfterViewInit() {
    const body = document.querySelector('body');

    if (!body) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node instanceof HTMLElement &&
            node.tagName === 'DIV' &&
            getComputedStyle(node).position === 'fixed'
          ) {
            node.style.display = 'none';
          }
        });
      });
    });

    observer.observe(body, {
      childList: true,
      subtree: true
    });
  }

  mostrarVersao() {

    const versao = environment ? environment.VERSION_APP : '0.0.0';
    const aplicacao = 'Psiacademic Analytics - Visualização de Informação';
    const ambiente = environment.production
      ? 'Produção'
      : 'Homologação';
    console.log(
      `%c${aplicacao}`,
      'color: hsl(221, 100%, 50%); font-size: 15px'
    );
    console.log(
      `%cVersão: ${versao} - ${ambiente}`,
      'color: hsl(221, 100%, 50%); font-size: 15px'
    );
  }
}


