import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class MetaInfoService {

  constructor(private titleService: Title, private metaService: Meta) { }

  setTitle(title: string) {
    this.titleService.setTitle(title);
  }

  setIcon(iconUrl: string) {
    const head = document.getElementsByTagName('head')[0];
    const existingLink = document.getElementById('favicon');
    if (existingLink) {
      head.removeChild(existingLink);
    }
    const link = document.createElement('link');
    link.id = 'favicon';
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = iconUrl;
    head.appendChild(link);
  }
}
