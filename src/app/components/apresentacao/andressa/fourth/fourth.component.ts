import { Component } from '@angular/core';

@Component({
  selector: 'app-fourth',
  templateUrl: './fourth.component.html',
  styleUrls: ['./fourth.component.scss']
})
export class FourthComponent {

  chavePix: string = 'patryck-lisboa@hotmail.com';

  openWhatsApp(element: HTMLElement) {
    this.elasticEffect(element);
    const whatsAppUrl = `https://chat.whatsapp.com/KpJLi94io9LCuyXTZ7cwi9`;
  
    setTimeout(() => {
      window.open(whatsAppUrl, '_blank');
    }, 500);
  }


  pagar() {
    // Lógica para gerar a chave PIX
    this.chavePix = 'SuaChavePixAqui';
  }

  elasticEffect(element: HTMLElement) {
    element.classList.add('clicked-elastic');
    setTimeout(() => {
      element.classList.remove('clicked-elastic');
    }, 1000);
  }
}
