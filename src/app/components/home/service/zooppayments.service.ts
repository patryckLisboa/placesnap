import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { HomeService } from './home.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
export class ZoopService {
  private readonly zoopApiUrl = 'https://api.zoop.ws/v1';
  private readonly apiKey = 'SUA_CHAVE_DE_API_ZOOP';

  constructor(private http: HttpClient) {}

  async createCheckoutSession(
    amount: number,
    description: string
  ): Promise<string> {
    const url = `${this.zoopApiUrl}/transactions`;

    const body = {
      amount: amount * 100, // Convertendo para centavos (o valor deve ser em centavos)
      currency: 'BRL',
      payment_type: 'pix',
      description: description,
    };

    const headers = new HttpHeaders({
      Authorization: `Basic ${btoa(this.apiKey)}`,
      'Content-Type': 'application/json',
    });

    try {
      const response = await firstValueFrom(
        this.http.post<any>(url, body, { headers })
      );

      // Verifica o status da transação na resposta
      if (response.status === 'paid') {
        return 'success'; // Pagamento bem-sucedido
      } else if (response.status === 'cancelled') {
        return 'cancelled'; // Pagamento cancelado
      } else {
        return 'pending'; // Pagamento pendente ou em outro estado
      }
    } catch (error) {
      console.error('Erro na solicitação à API da Zoop:', error);
      throw error;
    }
  }
}
