import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  larguraTela = window.innerWidth;

  @HostListener('window:resize', [])
  onResize() {
    this.larguraTela = window.innerWidth;
  }

  getZoom() {
    if (this.larguraTela < 550) {
      return this.larguraTela / 550;
    }
    return 1;
  }

  addActiveClass(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add('active');
    }
  }

  removeActiveClass(elementId: string) {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.remove('active');
    }
  }
}
