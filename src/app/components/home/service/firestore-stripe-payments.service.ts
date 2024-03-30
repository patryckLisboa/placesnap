import { Injectable } from '@angular/core';
import {
  getStripePayments,
  getProducts,
  createCheckoutSession,
  StripePayments,
  onCurrentUserSubscriptionUpdate,
} from '@invertase/firestore-stripe-payments';
import { getApp } from '@firebase/app';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreStripePaymentsService {
  private readonly stripeApiUrl = 'https://api.stripe.com/v1';
  private firestoreStripePayments: StripePayments;
  constructor(private http: HttpClient) {
    const app = getApp();
    this.firestoreStripePayments = getStripePayments(app, {
      productsCollection: 'products',
      customersCollection: 'customers',
    });
  }

  // async createCheckoutSession(myPriceId: string) {
  //   const returnUrl = window.location.origin;
  //   const session = await createCheckoutSession(this.firestoreStripePayments, {
  //     payment_method_types: ['card'],
  //     line_items: [{ price: myPriceId, quantity: 1 }],
  //     mode: 'payment',
  //     success_url: returnUrl + '/sucesso',
  //     cancel_url: returnUrl + '/cancel',
  //   });
  //   window.location.assign(session.url);
  // }

  // Iniciar uma sessão de checkout no Stripe
  async createCheckoutSession(myPriceId: string) {
    const returnUrl = window.location.origin;
    const requestBody = {
      payment_method_types: ['card'],
      line_items: [{ price: myPriceId, quantity: 1 }],
      mode: 'payment',
      success_url: returnUrl + '/sucesso',
      cancel_url: returnUrl + '/cancel',
    };
    const session = await this.stripeRequest('checkout/sessions', 'POST', requestBody)
    window.location.assign(session.url);
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

  // Criar um preço (price) para um produto no Stripe
  async criarPreco(productId: string, valor: number): Promise<any> {
    const requestBody = {
      product: productId,
      currency: 'BRL',
      unit_amount: valor * 100,
    };
    return this.stripeRequest('prices', 'POST', requestBody);
  }

  // Método genérico para fazer solicitações à API do Stripe
  private async stripeRequest(
    endpoint: string,
    method: string,
    body: any
  ): Promise<any> {
    const apiKey =
      'sk_test_51Oy3Sx2MC6fK0Zr25YJO74wbHN6BLRgUHOS3XE3TDbiugmaZq7zUR8Yp5kfahCa6vdV1gY1QILyj7d9AYU16IKmW00OwPVgCAx'; // Chave secreta do Stripe
    const url = `${this.stripeApiUrl}/${endpoint}`;
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    };
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
