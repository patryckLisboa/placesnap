import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  constructor(private router: Router) {}

  public verificarDominio(): void {
    const dominioAtual = window.location.hostname;
    switch (dominioAtual) {
      case 'mentoriadressapedrozza.com.br':
        this.router.navigate(['/andressa']);
        break;
      case 'ckya.com.br':
        this.router.navigate(['/bruno']);
        break;
      default:
        // Nenhum redirecionamento
    }
  }
}
