import { Component } from '@angular/core';
import { RedirectService } from './services/redirect/redirect.service';
import { MetaInfoService } from './services/metaInfo/meta-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'placesnap';
  metaTitle: string = '';
  metaIcon: string = '';

  constructor(private redirectService: RedirectService) {}

  ngOnInit(): void {
    this.redirectService.verificarDominio();
    this.disableZoom();
  }

  disableZoom() {
    const viewportMetaTag = document.querySelector('meta[name="viewport"]');
    if (viewportMetaTag) {
      viewportMetaTag.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    }
  }
}
