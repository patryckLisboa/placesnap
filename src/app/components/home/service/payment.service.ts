import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConteudocompradbService } from '../../../services/conteudocompradb/conteudocompradb.service';
import { ConteudocompraDb } from '../../../interfaces/conteudocompra-db';
import { firstValueFrom } from 'rxjs';
import { CompradbService } from '../../../services/compradb/compradb.service';
import { CompraDb } from '../../../interfaces/compra-db';
import { ConteudodbService } from '../../../services/conteudodb/conteudodb.service';
import { PMessageService } from '../../../shared/components/p-message/p-message.service';
import { ConteudoDb } from '../../../interfaces/conteudo-db';
// import { InvertasePayments } from '@invertase/firestore-stripe-payments';
import {
  addDoc,
  // collection,
  getFirestore,
  onSnapshot,
  doc,
  getDoc,
  collection,
} from 'firebase/firestore';
import { getApp } from '@firebase/app';
import { getStripePayments } from '@invertase/firestore-stripe-payments';
import { getProducts } from '@invertase/firestore-stripe-payments';
import { initializeFirestore } from 'firebase/firestore';
import { FirebaseApp } from '@angular/fire/app';
import { FirestoreStripePaymentsService } from './firestore-stripe-payments.service';
import { ZoopService } from './zooppayments.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private conteudocompradbService: ConteudocompradbService,
    private compraDbService: CompradbService,
    private conteudoDbService: ConteudodbService,
    private messageService: PMessageService,
    private firestoreStripePaymentsService: FirestoreStripePaymentsService,
    private zoopService: ZoopService
  ) {}

  async comprar(conteudo: ConteudoDb, userId: string) {
    const compraKey: any = await this.compraDbService.addCompra({
      dataefetivacao: new Date().toJSON(),
      usuarioKey: userId,
    } as CompraDb);

    if (!conteudo.key || !compraKey) {
      return this.messageService.showErrorMessage('Algo deu errado');
    }

    const compraconteudo: any =
      await this.conteudocompradbService.addConteudocompra({
        situacao: 'PENDENTE',
        conteudoKey: conteudo.key || '',
        compraKey,
      } as ConteudocompraDb);

    if (compraconteudo) {
      this.messageService.showSuccessMessage('Redirecionando para a página de pagamento...');
      await this.processarCompra(conteudo, userId);
    }
  }
  
  async confirmacaoPagamento(conteudo: ConteudoDb, userId: string) {
    //manipulações para mudar status de pagamento do conetudo e efetivação e etc...
  }

  async processarCompra(conteudo: ConteudoDb, userId: string) {
    if((conteudo.valor || 0) < 1){
      return this.messageService.showErrorMessage("Por enquanto só permitimos compras acima de R$ 1,00");
    }
    try {
      await this.firestoreStripePaymentsService.pagarCompra(conteudo, userId);
    } catch (error) {
      this.messageService.showErrorMessage('Erro ao processar pagamento');
    }
  }

  async iniciarCheckoutPIX() {
    try {
      const amount = 100; // Valor em reais
      const description = 'Descrição do pagamento PIX';
      const status = await this.zoopService.createCheckoutSession(amount, description);

      // Redirecionar o usuário com base no status da transação
      if (status === 'success') {
        window.location.href = '/sucesso'; // Redirecionar para página de sucesso
      } else if (status === 'cancelled') {
        window.location.href = '/cancelamento'; // Redirecionar para página de cancelamento
      } else {
        console.log('Pagamento pendente ou em outro estado.');
      }
    } catch (error) {
      console.error('Erro ao iniciar o checkout PIX:', error);
    }
  }

  async cancelarCompra(compraKey: string | null) {
    console.log(compraKey);
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
      this.cancelarCompra(conteudoCompra.compraKey || '');
    });
    this.conteudoDbService.deleteConteudo(conteudoKey);
  }
}
