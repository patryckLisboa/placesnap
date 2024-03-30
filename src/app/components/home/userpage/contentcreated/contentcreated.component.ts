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
    if (this.larguraTela < 450) {
      return this.larguraTela / 450;
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
      setTimeout(() => {
        const valor = this.monetarioParaValorBrasileiro(this.data.valor);
        this.conteudoFormGroup.patchValue({ ...this.data, valor });
      });
    }
  }

  onDestroy() {
    this.conteudoFormGroup.reset();
  }

  saveConteudo() {
    const valor = this.monetarioParaValorNumerico(
      this.conteudoFormGroup.get('valor').value
    );
    const descricao = this.conteudoFormGroup.get('descricao').value;
    this.homeService.addConteudo(this.data?.key, {
      ...this.conteudoFormGroup.value,
      descricao,
      valor,
    });
  }

  monetarioParaValorNumerico(valor: string): number {
    // Remove o símbolo 'R$' e substitui vírgula por ponto
    const valorNumerico = parseFloat(
      valor.replace(/[^\d,]/g, '').replace(',', '.')
    );

    // Retorna o valor numérico
    return isNaN(valorNumerico) ? 0 : valorNumerico;
  }

  monetarioParaValorBrasileiro(valor: number | bigint): string {
    // Arredonda o valor para duas casas decimais
    const valorArredondado = Number(valor).toFixed(2);

    // Converte o valor para uma string com separador de milhares e vírgula como separador decimal
    const partes = valorArredondado.split('.');
    const inteiro = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const decimal = partes[1];

    // Formata a string com o símbolo de moeda brasileiro
    const valorFormatado = 'R$ ' + inteiro + ',' + decimal;

    return valorFormatado;
  }

  filtrarNumerosInteiros(
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

  filtrarNumeros(
    input: HTMLInputElement,
    maxLength = 0,
    inputFormControl: string
  ) {
    if (!maxLength) {
      return;
    }
    let valor = input.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    valor = valor.replace(/^0+/, ''); // Remove os zeros à esquerda
    valor = valor.slice(0, maxLength + 2); // Limita o número de caracteres antes da vírgula

    // Adiciona a vírgula e os centavos
    if (valor.length > 2) {
      valor = valor.slice(0, -2) + ',' + valor.slice(-2);
    } else if (valor.length === 2) {
      valor = '0,' + valor;
    } else if (!valor.length) {
      valor = '0,00' + valor;
    } else {
      valor = '0,0' + valor;
    }

    // Adiciona o ponto de milhar, se necessário
    if (valor.length > 6) {
      valor = valor.slice(0, -6) + '.' + valor.slice(-6);
    }

    // Adiciona o "R$" antes do valor
    valor = 'R$ ' + valor;

    // Exibe "R$ 00,00" quando não houver valor
    if (valor === 'R$ ,') {
      valor = 'R$ 00,00';
    }

    // Atualiza o valor no campo de entrada e no formulário
    input.value = valor;
    this.conteudoFormGroup.get(inputFormControl).setValue(valor);
  }
}
