import { Component } from '@angular/core';
import { HomeService } from '../service/home.service';
import { PModalService } from '../../../shared/components/p-modal/p-modal.service';
import { ContentlocationComponent } from '../contentlocation/contentlocation.component';

@Component({
  selector: 'app-userpage',
  templateUrl: './userpage.component.html',
  styleUrls: ['./userpage.component.scss'],
})
export class UserpageComponent {
  constructor(
    public homeService: HomeService,
    private modalService: PModalService
  ) {}

  abrirLocalConteudo(conteudo: any) {
    this.modalService.openDialog(ContentlocationComponent, conteudo)
  }
}
