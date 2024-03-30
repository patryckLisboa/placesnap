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
} from 'firebase/firestore';
import { getApp } from '@firebase/app';
import { getStripePayments } from '@invertase/firestore-stripe-payments';
import { getProducts } from '@invertase/firestore-stripe-payments';
import { initializeFirestore } from 'firebase/firestore';
import { FirebaseApp } from '@angular/fire/app';
import { FirestoreStripePaymentsService } from './firestore-stripe-payments.service';

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

  ) {}

  async comprar(conteudo: ConteudoDb, userId: string) {
    const compraKey: any = await this.compraDbService.addCompra({
      dataefetivacao: new Date().toJSON(),
      usuarioKey: userId,
    } as CompraDb);

    if (!conteudo.key || !compraKey) {
      return this.messageService.showErrorMessage('algo deu errado');
    }

    const compraconteudo: any =
      await this.conteudocompradbService.addConteudocompra({
        situacao: 'PENDENTE',
        conteudoKey: conteudo.key || '',
        compraKey,
      } as ConteudocompraDb);

    if (compraconteudo) {
      this.messageService.showSuccessMessage('abrir parte da compra');
      await this.processarCompra(conteudo, userId);
      // await this.pagarCompra(conteudo, userId); //atualizar a data de efetivação da compra
    }
  }


  async processarCompra(conteudo: ConteudoDb, userId: string) {
    return

    try {
      // Criar um cliente no Stripe com o email do usuário
      await this.firestoreStripePaymentsService.createCheckoutSession('price_1OymAK2MC6fK0Zr2s3O4rDs7');
      
      // await addDoc(collection(firestore, 'customers', userId, 'checkout_sessions'), {
      //   session_id: checkoutSessionId,
      //   price: precoId,
      //   success_url: returnUrl,
      //   cancel_url: returnUrl,
      // });

      // // Agora, você deve redirecionar o usuário para a URL de checkout do Stripe
      // // A URL está disponível em checkoutSessionResponse.url
      // // O usuário será redirecionado para esta URL para finalizar o pagamento

    } catch (error) {
      console.error('Erro ao processar compra:', error);
      this.messageService.showErrorMessage('Erro ao processar compra');
    }
  }

  // async pagarCompra(conteudo: ConteudoDb, userId: string) {
  //   console.log(userId);
  //   const db = getFirestore();
  //   const checkoutSessionRef = collection(
  //     db,
  //     'customers',
  //     userId,
  //     'checkout_sessions'
  //   );

  //   console.log(checkoutSessionRef);
  //   const docRef = await addDoc(checkoutSessionRef, {
  //     price: 'price_1OymAK2MC6fK0Zr2s3O4rDs7',
  //     success_url: window.location.origin,
  //     cancel_url: window.location.origin,
  //   });
  //   return new Promise<string>((resolve, reject) => {
  //     const unsubscribe = onSnapshot(docRef, (snap) => {
  //       debugger;
  //       const { error, url } = snap.data() as {
  //         error?: { message: string };
  //         url?: string;
  //       };
  //       if (url) {
  //         console.log('Stripe Checkout URL:', url);
  //         unsubscribe();
  //         resolve(url);
  //       }
  //       if (error) {
  //         unsubscribe();
  //         reject(new Error(`An error occurred: ${error.message}`));
  //       }
  //     });
  //   });
  // }

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
