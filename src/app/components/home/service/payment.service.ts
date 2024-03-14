import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConteudocompradbService } from '../../../services/conteudocompradb/conteudocompradb.service';
import { ConteudocompraDb } from '../../../interfaces/conteudocompra-db';
import { firstValueFrom } from 'rxjs';
import { CompradbService } from '../../../services/compradb/compradb.service';
import { CompraDb } from '../../../interfaces/compra-db';
import { ConteudodbService } from '../../../services/conteudodb/conteudodb.service';
import { PMessageService } from '../../../shared/components/p-message/p-message.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  placerKey = '';

  constructor(
    private route: ActivatedRoute,
    private conteudocompradbService: ConteudocompradbService,
    private compraDbService: CompradbService,
    private conteudoDbService: ConteudodbService,
    private messageService: PMessageService
  ) {
    this.placerKey = this.route.snapshot.queryParams['placer'];
  }

  async comprar(conteudoKey: string, userId: string) {
    const compraKey: any = await this.compraDbService.addCompra({
      dataefetivacao: new Date().toJSON(),
      usuarioKey: userId,
    } as CompraDb);

    if (!conteudoKey || !compraKey) {
      return this.messageService.showErrorMessage('algo deu errado');
    }

    const compraconteudo: any =
      await this.conteudocompradbService.addConteudocompra({
        situacao: 'PENDENTE',
        conteudoKey,
        compraKey,
      } as ConteudocompraDb);

    if (compraconteudo) {
      this.messageService.showSuccessMessage('abrir parte da compra');
      // this.pagarCompra;    atualizar a data de efetivação da compra
    }
  }

  async cancelarCompra(compraKey: string | null) {
    console.log(compraKey)
    if (!compraKey) {
      return this.messageService.showErrorMessage('algo deu errado');
    }
    const conteudoCompras: ConteudocompraDb[] = await firstValueFrom(
      this.conteudocompradbService.getConteudocomprasCompra(compraKey)
    );
    conteudoCompras.forEach((conteudoCompra) => {
      this.conteudocompradbService.deleteConteudocompra(
        conteudoCompra.key || ''
      );
    });
    this.compraDbService.deleteCompra(compraKey);
  }

  async cancelarConteudo(conteudoKey: string | null) {
    if (!conteudoKey) {
      return this.messageService.showErrorMessage('algo deu errado');
    }
    const conteudoCompras: ConteudocompraDb[] = await firstValueFrom(
      this.conteudocompradbService.getConteudocomprasConteudo(conteudoKey)
    );
    conteudoCompras.forEach((conteudoCompra) => {
      this.cancelarCompra(conteudoCompra.compraKey || '')
    });
    this.conteudoDbService.deleteConteudo(conteudoKey);
  }
}
