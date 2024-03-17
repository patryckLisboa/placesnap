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

@Component({
  selector: 'app-contentcreated',
  templateUrl: './contentcreated.component.html',
  styleUrls: ['./contentcreated.component.scss'],
})
export class ContentcreatedComponent {
  faXmark = faXmark;
  faUserAlt = faUserAlt;
  faWindowMinimize = faWindowMinimize;
  larguraTela = window.innerWidth;

  conteudoFormGroup: any = new FormGroup({
    titulo: new FormControl(null, [
      Validators.required,
      Validators.maxLength(100),
    ]),
    descricao: new FormControl(null, [
      Validators.required,
      Validators.maxLength(1000),
    ]),
    nivel: new FormControl(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(9),
    ]),
    valor: new FormControl(null, [Validators.required, Validators.max(99999)]),
  });

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
    public conteudodbService: ConteudodbService,
    public homeService: HomeService,
    public dialogRef: MatDialogRef<ContentcreatedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngAfterViewInit() {
    if (this.data) {
      console.log(this.data);
      setTimeout(() => {
        this.conteudoFormGroup.patchValue(this.data);
      });
    }
  }

  onDestroy() {
    this.conteudoFormGroup.reset();
  }

  saveConteudo() {
    const descricao = this.conteudoFormGroup.get('descricao').value;
    this.homeService.addConteudo(this.data?.key, {
      ...this.conteudoFormGroup.value,
      descricao,
    });
  }

  filtrarNumeros(
    input: HTMLInputElement,
    maxLength = 0,
    inputFormControl: string
  ) {
    if (!maxLength) {
      return;
    }
    let valor = input.value.replace(/[^\d]/g, '');
    valor = valor.replace(/^0+(?!$)/, '');
    valor = valor.slice(0, maxLength);
    valor = valor || '0';
    input.value = valor;
    this.conteudoFormGroup.get(inputFormControl).setValue(valor);
  }

}
