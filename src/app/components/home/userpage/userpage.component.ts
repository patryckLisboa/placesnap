import { Component, HostListener } from '@angular/core';
import { HomeService } from '../service/home.service';
import { PModalService } from '../../../shared/components/p-modal/p-modal.service';
import { ContentlocationComponent } from './contentlocation/contentlocation.component';
import {
  faChartPie,
  faCircleLeft,
  faHandHoldingDollar,
  faPenToSquare,
  faPlus,
  faUserAlt,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { ContentcreatedComponent } from './contentcreated/contentcreated.component';
import { firstValueFrom } from 'rxjs';
import { UsuariodbService } from '../../../services/usuariodb/usuariodb.service';
import { PaymentService } from '../service/payment.service';
import { UsuarioDb } from '../../../interfaces/usuario-db';
import { PerfileditComponent } from './perfiledit/perfiledit.component';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss'],
})
export class UserpageComponent {
  faUserAlt = faUserAlt;
  faCircleLeft = faCircleLeft;
  faPlus = faPlus;
  faXmark = faXmark;
  faChartPie = faChartPie;
  faPenToSquare = faPenToSquare;
  faHandHoldingDollar = faHandHoldingDollar;
  showNameTooltip: boolean = false;
  showCardTitleTooltip: boolean[] = [];

  constructor(
    public homeService: HomeService,
    private modalService: PModalService
  ) {}

  larguraTela = window.innerWidth;

  @HostListener('window:resize', [])
  onResize() {
    this.larguraTela = window.innerWidth;
  }

  getZoom() {
    if (this.larguraTela < 350) {
      return this.larguraTela / 350;
    }
    return 1;
  }

  abrirLocalConteudo(conteudo: any) {
    this.modalService.openDialog(ContentlocationComponent, conteudo);
  }

  abrirCriacaoConteudo(conteudo: any = null) {
    this.modalService.openDialog(ContentcreatedComponent, conteudo);
  }

  abrirEdicaoPerfil() {
    this.modalService.openDialog(
      PerfileditComponent,
      this.homeService.userAuth.displayName || this.homeService.userAuth.email
    );
  }

  escluirConteudoConfirmacao(chaveConteudo: string) {
    this.modalService.openQuestionDialog(
      'Todas as informações de pagamento do conteúdo serão perdidas permanentemente!',
      () => {
        this.executarExclusao(chaveConteudo);
      }
    );
  }

  executarExclusao(chaveUsuario: string) {
    this.homeService.removeConteudo(chaveUsuario);
  }

  monetarioParaValorBrasileiro(valor: number | string) {
    // Arredonda o valor para duas casas decimais
    const valorArredondado = Number(valor).toFixed(2);

    // Converte o valor para uma string com separador de milhares e vírgula como separador decimal
    const partes = valorArredondado.split('.');
    const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const decimal = partes[1];

    // Formata a string com o símbolo de moeda brasileiro
    const valorFormatado = 'R$ ' + inteiro + ',' + decimal;

    return valorFormatado.split(/[ ,]+/);;
  }
}
