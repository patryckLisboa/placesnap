import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MetaInfoService } from '../metaInfo/meta-info.service';

@Injectable({
  providedIn: 'root',
})
export class RedirectService {
  constructor(
    private router: Router,
    private metaInfoService: MetaInfoService
  ) {}

  public verificarDominio(): void {
    const dominioAtual = window.location.hostname;
    switch (dominioAtual) {
      case 'localhost':
        this.router.navigate(['/bruno']);
        this.metaInfoService.setTitle('PlaceSnap');
        this.metaInfoService.setIcon('./assets/img/placesnap.jpg');
        break;
      case 'mentoriadressapedrozza.com.br':
        this.router.navigate(['/andressa']);
        this.metaInfoService.setTitle('Andressa Pedrozza Mentoria');
        this.metaInfoService.setIcon(
          './assets/img/andressa/11zon_cropped (1).png'
        );
        break;
      case 'ckya.com.br':
        this.router.navigate(['/bruno']);
        this.metaInfoService.setTitle('PlaceSnap');
        this.metaInfoService.setIcon('./assets/img/placesnap.jpg');
        break;
      case 'placesnap.netlify.app':
        this.router.navigate(['/bruno']);
        this.metaInfoService.setTitle('PlaceSnap');
        this.metaInfoService.setIcon('./assets/img/placesnap.jpg');
        break;
      default:
      // Nenhum redirecionamento
    }
  }

  public navigateToRoot(): void {
    this.router.navigate(['/']);
  }

  navigateToHome(placer: any = null) {
    if (placer) {
      return this.router.navigate(['/home'], {
        queryParams: { placer: placer }, //jeovana.silvajeovanasilvajeova@gmail.com
      });
    }
    return this.navigateToRoot();
  }
}
