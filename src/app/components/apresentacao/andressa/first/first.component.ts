import { Component } from '@angular/core';

@Component({
  selector: 'app-first',
  templateUrl: './first.component.html',
  styleUrls: ['./first.component.scss'],
})
export class FirstComponent {

  openPage(element: HTMLElement, url = '') {
    this.elasticEffect(element);
    setTimeout(() => {
      window.open(url);
    }, 500);
  }

  openTikTok(element: HTMLElement) {
    this.openPage(element, `https://www.tiktok.com/@dressapedrozza`);
  }

  openInstagram(element: HTMLElement) {
    this.openPage(element, `https://www.instagram.com/andressapedrozza/`);
  }

  elasticEffect(element: HTMLElement) {
    element.classList.add('clicked-elastic');
    setTimeout(() => {
      element.classList.remove('clicked-elastic');
    }, 1000);
  }
}
