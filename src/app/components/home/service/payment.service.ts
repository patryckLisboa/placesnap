import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConteudocompradbService } from '../../../services/conteudocompradb/conteudocompradb.service';
import { ConteudocompraDb } from '../../../interfaces/conteudocompra-db';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  placerKey = '';

  constructor(private route: ActivatedRoute, private conteudocompradbService: ConteudocompradbService) {
    console.log(this.route.snapshot.queryParams['placer'])
    this.placerKey = this.route.snapshot.queryParams['placer'];
  }

  async comprar(conteudoKey : string | null, compraKey: string | null) {
    if(!conteudoKey || !compraKey){
      return console.log("algo deu errado")
    }

    const compraconteudo: any = await this.conteudocompradbService.addConteudocompra({
      situacao: "PENDENTE",
      conteudoKey,
      compraKey,
    } as ConteudocompraDb);

    if(compraconteudo){
      console.log("abrir parte da compra")
      // this.pagarCompra;    atualizar a data de efetivação da compra

    }
  }
}
