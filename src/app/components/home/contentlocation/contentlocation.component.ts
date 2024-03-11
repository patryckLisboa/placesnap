import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { HomeService } from '../service/home.service';
import { Subscription, firstValueFrom } from 'rxjs';
import { ConteudocompradbService } from '../../../services/conteudocompradb/conteudocompradb.service';
import { ConteudocompraDb } from '../../../interfaces/conteudocompra-db';
import { CompradbService } from '../../../services/compradb/compradb.service';
import { CompraDb } from '../../../interfaces/compra-db';
import { UsuariodbService } from '../../../services/usuariodb/usuariodb.service';
import { UsuarioDb } from '../../../interfaces/usuario-db';
import { ChangeDetectorRef } from '@angular/core';

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
  comprasUsuarios: ComprasUsuariosDB[] = [];
  // comprasUsuariosTeste: ComprasUsuariosDB[] = [
  //   {
  //     compra: { key:"4123554", dataefetivacao: '2024-03-10' },
  //     usuario: {key:"415456323",  email: 'usuario1@example.com' }
  //   },
  //   {
  //     compra: {key:"4126535",  dataefetivacao: '2024-03-09' },
  //     usuario: {key:"4125863",  email: 'usuario2@example.com'}
  //   },
  // ];

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
    console.log(this.comprasUsuarios);
  }

  ngOnInit() {
    this.consultarConteudoCompras();
  }

  onDestroy(): void {}

  async consultarConteudoCompras() {
    const conteudocompras = await firstValueFrom(
      this.conteudocompradbService.getConteudocomprasConteudo(this.data.key)
    );
    conteudocompras.forEach((conteudocompra) => {
      if (conteudocompra.compraKey) {
        this.consultarCompraConteudoCompra(conteudocompra.compraKey);
      }
    });
  }

  async consultarCompraConteudoCompra(conteudocompra: string) {
    const compra = await firstValueFrom(
      this.compradbService.getCompraById(conteudocompra)
    );

    if (compra?.usuarioKey) {
      const usuario = await firstValueFrom(
        this.usuarioDbService.getUsuarioById(compra.usuarioKey)
      );
      console.log(usuario, compra);

      if (compra && usuario) {
        this.comprasUsuarios.push({ compra, usuario });
        this.cdRef.markForCheck();
      }
    }
  }
}
