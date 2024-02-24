import { Component } from '@angular/core';

@Component({
  selector: 'app-andressa',
  templateUrl: './andressa.component.html',
  styleUrls: ['./andressa.component.scss'],
})
export class AndressaComponent {
  expanded = false;
  navList = [
    'sobre mim',
    'meus resultados',
    'Atendimento',
    'Grupo do WhatsApp',
  ];

  toggleMobileNav(){
    this.expanded = !this.expanded;
  }
}
