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
import { ConteudodbService } from '../../../../services/conteudodb/conteudodb.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PImageuploadService } from '../../../../shared/components/p-imageupload/p-imageupload.service';

@Component({
  selector: 'app-perfiledit',
  templateUrl: './perfiledit.component.html',
  styleUrls: ['./perfiledit.component.scss'],
})
export class PerfileditComponent {
  faXmark = faXmark;
  faUserAlt = faUserAlt;
  faWindowMinimize = faWindowMinimize;
  larguraTela = window.innerWidth;
  email = '';
  urlImageToSave: any;
  nome: FormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(60),
  ]);

  @HostListener('window:resize', [])
  onResize() {
    this.larguraTela = window.innerWidth;
  }

  getZoom() {
    if (this.larguraTela < 450) {
      return this.larguraTela / 450;
    }
    return 1;
  }

  constructor(
    public conteudodbService: ConteudodbService,
    public homeService: HomeService,
    private imageUploadService: PImageuploadService,
    public dialogRef: MatDialogRef<PerfileditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.email = this.homeService.userAuth.email;
  }

  ngAfterViewInit() {
    if (this.data) {
      setTimeout(() => {
        this.nome.setValue(this.data);
      });
    }
  }

  onDestroy() {
    this.nome.reset();
  }

  async saveUsuario() {
    this.homeService.authService.loadingUser = true;
    const urlToFireStorage = await this.imageUploadService.uploadImage(
      this.email,
      this.urlImageToSave
    );
    await this.homeService.alterarInfosUsuarioLogado(
      this.nome.value,
      urlToFireStorage || ''
    );
    this.homeService.authService.loadingUser = false;
  }

  setImageUrl(event: File | null) {
    this.urlImageToSave = event;
  }
}
