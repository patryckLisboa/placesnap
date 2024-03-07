import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RedirectService } from './services/redirect/redirect.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'placesnap';
  constructor(private redirectService: RedirectService) {}

  ngOnInit(): void {
    this.redirectService.verificarDominio();
  }
}
