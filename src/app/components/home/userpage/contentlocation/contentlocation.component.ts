import { Component, HostListener, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { HomeService } from '../../service/home.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { ConteudocompradbService } from '../../../../services/conteudocompradb/conteudocompradb.service';
import { ConteudocompraDb } from '../../../../interfaces/conteudocompra-db';
import { CompradbService } from '../../../../services/compradb/compradb.service';
import { CompraDb } from '../../../../interfaces/compra-db';
import { UsuariodbService } from '../../../../services/usuariodb/usuariodb.service';
import { UsuarioDb } from '../../../../interfaces/usuario-db';
import { ChangeDetectorRef } from '@angular/core';
import {
  faCompress,
  faUserAlt,
  faWindowMinimize,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

export interface ComprasUsuariosDB {
  compra: CompraDb;
  usuario: UsuarioDb;
}

@Component({
  selector: 'app-contentlocation',
  templateUrl: './contentlocation.component.html',
  styleUrls: ['./contentlocation.component.scss'],
})
export class ContentlocationComponent {
  faXmark = faXmark;
  faUserAlt = faUserAlt;
  faWindowMinimize = faWindowMinimize;

  comprasUsuarios: ComprasUsuariosDB[] = [];
  larguraTela = window.innerWidth;

  @HostListener('window:resize', [])
  onResize() {
    this.larguraTela = window.innerWidth;
  }

  getZoom() {
    if (this.larguraTela < 550) {
      return this.larguraTela / 550;
    }
    return 1;
  }

  constructor(
    public conteudocompradbService: ConteudocompradbService,
    public compradbService: CompradbService,
    public usuarioDbService: UsuariodbService,
    public homeService: HomeService,
    private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ContentlocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  teste() {
    console.log('teste');
    console.log(this.comprasUsuarios);
  }

  ngOnInit() {
    this.consultarConteudoCompras();
  }

  onDestroy(): void {}

  async consultarConteudoCompras() {
    console.log(this.data);
    const conteudocompras = await firstValueFrom(
      this.conteudocompradbService.getConteudocomprasConteudo(this.data.key)
    );
    conteudocompras.forEach((conteudocompra) => {
      if (conteudocompra.compraKey) {
        this.consultarCompraConteudoCompra(conteudocompra.compraKey);
      }
    });
  }

  async consultarCompraConteudoCompra(compraKey: string) {
    const compra = await firstValueFrom(
      this.compradbService.getCompraById(compraKey)
    );

    if (compra?.usuarioKey) {
      const usuario = await firstValueFrom(
        this.usuarioDbService.getUsuarioById(compra.usuarioKey)
      );

      if (compra && usuario) {
        compra.key = compraKey;
        this.comprasUsuarios.push({ compra, usuario });
        this.cdRef.markForCheck();
      }
    }
  }
  async removerCompraUsuario(compraKey: string) {
    this.homeService.removeCompra(compraKey);
    this.comprasUsuarios = this.comprasUsuarios.filter(
      (item) => item.compra.key !== compraKey
    );
  }
  formatarDataParaBrasileiro(dataString: string): string {
    // Criar um objeto de data
    const data = new Date(dataString);

    // Formatar a data para o formato brasileiro
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Sao_Paulo', // Definindo o fuso horário para o Brasil
    };

    return data.toLocaleString('pt-BR', options);
  }
}
