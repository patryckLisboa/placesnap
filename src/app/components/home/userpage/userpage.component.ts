import { Component, HostListener } from '@angular/core';
import { HomeService } from '../service/home.service';
import { PModalService } from '../../../shared/components/p-modal/p-modal.service';
import { ContentlocationComponent } from './contentlocation/contentlocation.component';
import { faChartPie, faCircleLeft, faHandHoldingDollar, faPenToSquare, faPlus, faUserAlt, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ContentcreatedComponent } from './contentcreated/contentcreated.component';
import { firstValueFrom } from 'rxjs';
import { UsuariodbService } from '../../../services/usuariodb/usuariodb.service';
import { PaymentService } from '../service/payment.service';
import { UsuarioDb } from '../../../interfaces/usuario-db';

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
  showEmailTooltip: boolean = false;
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
    this.modalService.openDialog(ContentlocationComponent, conteudo)
  }

  criacaoConteudo(conteudo: any = null) {
    this.modalService.openDialog(ContentcreatedComponent, conteudo)
  }

} 
