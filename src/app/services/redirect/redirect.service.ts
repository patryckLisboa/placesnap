import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MetaInfoService } from '../metaInfo/meta-info.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  constructor(private router: Router, private metaInfoService: MetaInfoService) {}

  public verificarDominio(): void {
    const dominioAtual = window.location.hostname;
    switch (dominioAtual) {
      case 'localhost':
        this.router.navigate(['/home']);
        this.metaInfoService.setTitle('PlaceSnap');
        this.metaInfoService.setIcon('./assets/img/placesnap.jpg');
        break;
      case 'mentoriadressapedrozza.com.br':
        this.router.navigate(['/andressa']);
        this.metaInfoService.setTitle('Andressa Pedrozza Mentoria');
        this.metaInfoService.setIcon('./assets/img/andressa/logo-andressa-mentoria.png');
        break;
      case 'ckya.com.br':
        this.router.navigate(['/placesnap']);
        this.metaInfoService.setTitle('PlaceSnap');
        this.metaInfoService.setIcon('./assets/img/placesnap.jpg');
        break;
      default:
        // Nenhum redirecionamento
    }
  }
}
