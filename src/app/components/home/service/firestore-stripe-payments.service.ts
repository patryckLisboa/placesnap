import { Injectable } from '@angular/core';
import {
  getStripePayments,
  getProducts,
  createCheckoutSession,
  StripePayments,
  onCurrentUserSubscriptionUpdate,
  StripePaymentsOptions,
} from '@invertase/firestore-stripe-payments';
import { getApp } from '@firebase/app';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';
import { ConteudoDb } from '../../../interfaces/conteudo-db';

@Injectable({
  providedIn: 'root',
})

//https://docs.stripe.com/payments/checkout/migrating-prices <--- detalhes

//https://docs.stripe.com/payments/accept-a-payment

//https://docs.stripe.com/api/prices/object
export class FirestoreStripePaymentsService {
  private readonly stripeApiUrl = 'https://api.stripe.com/v1';
  // private firestoreStripePayments: StripePayments;
  constructor(private http: HttpClient) {
    // const app = getApp();
    // const stripePaymentsOptions: StripePaymentsOptions = {
    //   productsCollection: 'products',
    //   customersCollection: 'customers',
    // };
    // this.firestoreStripePayments = getStripePayments(app, stripePaymentsOptions);
  }

  async createCheckoutSession(conteudo: ConteudoDb) {
    // this.createCheckoutSessionByPriceId()
    const returnUrl = window.location.origin;
    const requestBody = new URLSearchParams();
    requestBody.append('payment_method_types[0]', 'card');
    requestBody.append('line_items[0][price_data][currency]', 'brl');
    requestBody.append(
      'line_items[0][price_data][product_data][name]',
      conteudo.titulo || ''
    );
    requestBody.append(
      'line_items[0][price_data][product_data][description]',
      conteudo.descricao || ''
    );
    requestBody.append(
      'line_items[0][price_data][product_data][images][0]',
      'https://static.wixstatic.com/media/b235b0_fede6604523a48c886021678649ccf96~mv2.jpg/v1/fill/w_600,h_600,al_c,q_80,enc_auto/b235b0_fede6604523a48c886021678649ccf96~mv2.jpg'
    ); // Adicionando a URL da imagem
    requestBody.append(
      'line_items[0][price_data][unit_amount]',
      ((conteudo.valor || 0) * 100).toString()
    );
    requestBody.append(
      'line_items[0][price_data][recurring][interval]',
      'month'
    );
    requestBody.append('line_items[0][quantity]', '1');

    requestBody.append('line_items[1][price_data][currency]', 'brl');
    requestBody.append(
      'line_items[1][price_data][product_data][name]',
      'Taxa de 3%'
    );
    requestBody.append(
      'line_items[1][price_data][unit_amount]',
      ((conteudo.valor || 0) * 0.03 * 100).toString()
    );
    requestBody.append('line_items[1][quantity]', '1');

    requestBody.append('mode', 'subscription');
    requestBody.append('success_url', `${returnUrl}/home?internalLoading=true`);
    requestBody.append('cancel_url', `${returnUrl}/home?internalLoading=true`);

    const session = await this.stripeRequest(
      'checkout/sessions',
      'POST',
      requestBody.toString()
    );
    window.location.assign(session.url);
  }

  async pagarCompra(conteudo: ConteudoDb, userId: string) {
    const db = getFirestore();
    const checkoutSessionRef = collection(
      db,
      'customers',
      userId,
      'checkout_sessions'
    );

    const docRef = await addDoc(checkoutSessionRef, {
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: conteudo.titulo || '',
              metadata: { conteudoKey: conteudo.key },
              description: conteudo.descricao || '',
              images: [
                'https://static.wixstatic.com/media/b235b0_fede6604523a48c886021678649ccf96~mv2.jpg/v1/fill/w_600,h_600,al_c,q_80,enc_auto/b235b0_fede6604523a48c886021678649ccf96~mv2.jpg',
              ], // Adicionando a URL da imagem
            },
            unit_amount: ((conteudo.valor || 0) * 100).toString(),
            recurring: {
              interval: 'month',
            },
          },
          quantity: '1',
        },
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Taxa de 3%',
            },
            unit_amount: ((conteudo.valor || 0) * 0.03 * 100).toString(),
          },
          quantity: '1',
        },
      ],
      metadata: { conteudoKey: conteudo.key },
      success_url: `${window.location.origin}/home?internalLoading=true`,
      cancel_url: `${window.location.origin}/home?internalLoading=true`,
      mode: 'subscription',
    });

    return new Promise<string>((resolve, reject) => {
      const unsubscribe = onSnapshot(docRef, (snap) => {
        const { error, url } = snap.data() as {
          error?: { message: string };
          url?: string;
        };
        if (url) {
          console.log('Stripe Checkout URL:', url);
          unsubscribe();
          window.location.assign(url);
          resolve(url);
        }
        if (error) {
          unsubscribe();
          reject(new Error(`An error occurred: ${error.message}`));
        }
      });
    });
  }

  async cancelarAssinatura(userId: string, sessionId: string) {
    try {
      const db = getFirestore();
      const sessionRef = doc(
        db,
        'customers',
        userId,
        'checkout_sessions',
        sessionId
      );

      await deleteDoc(sessionRef);

      console.log('Assinatura cancelada com sucesso.');
    } catch (error) {
      console.error('Erro ao cancelar a assinatura:', error);
      throw error;
    }
  }

  onCurrentUserSubscriptionUpdate() {
    // onCurrentUserSubscriptionUpdate(
    //   this.firestoreStripePayments,
    //   (snapshot) => {
    //     for (const change of snapshot.changes) {
    //       if (change.type === 'added') {
    //         console.log(
    //           `New subscription added with ID: ${change.subscription.id}`
    //         );
    //       }
    //       console.log(change);
    //     }
    //   }
    // );
  }

  // Criar um preço (price) para um produto no Stripe
  async criarPreco(productId: string, valor: number): Promise<any> {
    const requestBody = {
      product: productId,
      currency: 'BRL',
      unit_amount: valor * 100,
    };
    return this.stripeRequest('prices', 'POST', requestBody);
  }

  //fazem sozinho esses aqui não precisam

  // Criar um cliente no Stripe
  async criarCliente(email: string): Promise<any> {
    const requestBody = { email };
    return this.stripeRequest('customers', 'POST', requestBody);
  }

  // Criar um produto no Stripe
  async criarProduto(nome: string, descricao: string): Promise<any> {
    const requestBody = { name: nome, description: descricao, type: 'good' };
    return this.stripeRequest('products', 'POST', requestBody);
  }

  // async criarCobranca(amount: number) {
  //   const user = this.homeService.userAuth;
  //   if (!user) throw new Error('Usuário não autenticado');
  //   return await this.firestoreStripePayments.createCharge({
  //     userId: user.uid,
  //     amount,
  //     currency: 'BRL', // Especifica a moeda como BRL (Real Brasileiro)
  //     description: 'Descrição da cobrança em português',
  //   });
  // }

  // Método genérico para fazer solicitações à API do Stripe
  private async stripeRequest(
    endpoint: string,
    method: string,
    body: any
  ): Promise<any> {
    const apiKey =
      'sk_test_51Oy3Sx2MC6fK0Zr25YJO74wbHN6BLRgUHOS3XE3TDbiugmaZq7zUR8Yp5kfahCa6vdV1gY1QILyj7d9AYU16IKmW00OwPVgCAx'; // Sua chave secreta do Stripe
    const url = `${this.stripeApiUrl}/${endpoint}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    });

    try {
      const response = await firstValueFrom(
        this.http.request(method, url, { headers, body })
      );
      return response;
    } catch (error) {
      console.error('Erro na solicitação ao Stripe:', error);
      throw error;
    }
  }

  //preco configurado

  async createCheckoutSessionByPriceId() {
    const returnUrl = window.location.origin;

    const requestBody = new URLSearchParams();
    requestBody.append('payment_method_types[0]', 'card');
    requestBody.append(
      'line_items[0][price]',
      'price_1OymAK2MC6fK0Zr2s3O4rDs7'
    );
    requestBody.append('line_items[0][quantity]', '1');
    requestBody.append('mode', 'subscription');
    requestBody.append('success_url', `${returnUrl}/bruno?sucesso=true`);
    requestBody.append('cancel_url', `${returnUrl}/bruno?sucesso=true`);

    const session = await this.stripeRequest(
      'checkout/sessions',
      'POST',
      requestBody.toString()
    );
    console.log(session.url);
    window.location.assign(session.url);
  }

  // METODOS QUE NÃO FUCNIONAM OU EU PRECISO DAR UMA OLHADA MAIS A FUNDO

  // async createPortalLink() {
  //   const functionRef = firebase
  //     .app()
  //     .functions('us-west2')
  //     .httpsCallable('ext-firestore-stripe-payments-createPortalLink');
  //   const { data } = await functionRef({
  //     returnUrl: window.location.origin,
  //     locale: 'auto', // Optional, defaults to "auto"
  //     configuration: 'bpc_1JSEAKHYgolSBA358VNoc2Hs', // Optional ID of a portal configuration: https://stripe.com/docs/api/customer_portal/configuration
  //   });
  //   window.location.assign(data.url);
  // }

  // // Criar um cliente no Stripe usando o plugin
  // async criarCliente() {
  //   const user = this.homeService.userAuth;
  //   if (!user) throw new Error('Usuário não autenticado');
  //   return await this.firestoreStripePayments.createCustomer({
  //     userId: user.uid,
  //     email: user.email,
  //   });
  // }

  // // Criar um pagamento recorrente no Stripe usando o plugin
  // async criarPagamentoRecorrente(
  //   clienteId: string,
  //   precoId: string,
  //   returnUrl: string
  // ) {
  //   const user = this.homeService.userAuth;
  //   if (!user) throw new Error('Usuário não autenticado');
  //   return await this.firestoreStripePayments.createSubscription({
  //     userId: user.uid,
  //     customerId: clienteId,
  //     priceId: precoId,
  //     returnUrl,
  //   });
  // }

  // Outros métodos conforme necessário
}
