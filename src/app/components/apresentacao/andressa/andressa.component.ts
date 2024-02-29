import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-andressa',
  templateUrl: './andressa.component.html',
  styleUrls: ['./andressa.component.scss'],
})
export class AndressaComponent {
  larguraTela = window.innerWidth;

  @HostListener('window:resize', [])
  onResize() {
    this.larguraTela = window.innerWidth;
  }

  getZoom() {
    if(this.larguraTela < 350){
      return this.larguraTela / 350;
    }
    return 1
  }
}
