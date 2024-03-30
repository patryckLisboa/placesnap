import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HomeService } from './home.service';

interface StripeCustomer {
  email: string;
  metadata?: any;
}

interface StripeProduct {
  name: string;
  description: string;
  active?: boolean;
  metadata?: any;
}

interface StripePrice {
  product: string;
  currency: string;
  unit_amount: number;
  recurring?: any;
  metadata?: any;
}

interface StripeCheckoutSession {
  payment_method_types: string[];
  customer: string;
  line_items: any[];
  mode: string;
  success_url: string;
  cancel_url: string;
  metadata?: any;
}

@Injectable({
  providedIn: 'root',
})


//acho que isso tudo aqui não vai servir para nada
export class PaymentsFirestoreService {
  // constructor(
  //   private firestore: AngularFirestore,
  //   private homeService: HomeService
  // ) {}

  
  // // Criar um cliente no Stripe
  // async criarCliente() {
  //   const clienteRef = await this.firestore
  //     .collection<StripeCustomer>('customers')
  //     .add({ email: this.homeService.userAuth.email });
  //   return clienteRef.id;
  // }

  // // Criar um produto no Stripe
  // async criarProduto(description: string) {
  //   const produtoRef = await this.firestore
  //     .collection<StripeProduct>('products')
  //     .add({
  //       name: this.homeService.userAuth.displayName,
  //       description,
  //       active: true,
  //     });
  //   return produtoRef.id;
  // }

  // async consultarProduto() {
  //   const produtosRef = await this.firestore.collection('products').get();
  //   produtosRef.forEach((doc) => {
  //     console.log(doc);
  //   });
  // }

  // // Criar um preço para um produto no Stripe
  // async criarPreco(productId: string, valor: number, moeda: string) {
  //   const precoRef = await this.firestore
  //     .collection<StripePrice>('stripe_prices')
  //     .add({ product: productId, currency: moeda, unit_amount: valor * 100 });
  //   return precoRef.id;
  // }

  // // Iniciar uma sessão de checkout no Stripe
  // async iniciarSessaoCheckout(
  //   clienteId: string,
  //   precoId: string,
  //   returnUrl: string
  // ) {
  //   const sessaoRef = await this.firestore
  //     .collection<StripeCheckoutSession>('checkout_sessions')
  //     .add({
  //       payment_method_types: ['card'],
  //       customer: clienteId,
  //       line_items: [{ price: precoId, quantity: 1 }],
  //       mode: 'payment',
  //       success_url: returnUrl,
  //       cancel_url: returnUrl,
  //     });

  //   return sessaoRef.id;
  // }

  // // Excluir um cliente do Stripe
  // async excluirCliente(clienteId: string) {
  //   await this.firestore.collection('customers').doc(clienteId).delete();
  // }

  // // Atualizar um cliente do Stripe
  // async atualizarCliente(
  //   clienteId: string,
  //   novosDados: Partial<StripeCustomer>
  // ) {
  //   await this.firestore
  //     .collection('customers')
  //     .doc(clienteId)
  //     .update(novosDados);
  // }

  // // Excluir um produto do Stripe
  // async excluirProduto(produtoId: string) {
  //   await this.firestore.collection('products').doc(produtoId).delete();
  // }

  // // Atualizar um produto do Stripe
  // async atualizarProduto(
  //   produtoId: string,
  //   novosDados: Partial<StripeProduct>
  // ) {
  //   //ver pra que serve esse Partial
  //   await this.firestore
  //     .collection('products')
  //     .doc(produtoId)
  //     .update(novosDados);
  // }

  // // Excluir um preço do Stripe
  // async excluirPreco(precoId: string) {
  //   await this.firestore.collection('stripe_prices').doc(precoId).delete();
  // }

  // // Atualizar um preço do Stripe
  // async atualizarPreco(precoId: string, novosDados: Partial<StripePrice>) {
  //   await this.firestore
  //     .collection('stripe_prices')
  //     .doc(precoId)
  //     .update(novosDados);
  // }

  // Outros métodos conforme necessário
}
