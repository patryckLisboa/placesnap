import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bruno',
  templateUrl: './bruno.component.html',
  styleUrls: ['./bruno.component.scss'],
})
export class BrunoComponent {
  constructor(private router: Router) {}

  navigateToHome() {
    this.router.navigate(['/home'], {
      queryParams: { placer: 'fulano@domain.com' }, //jeovana.silvajeovanasilvajeova@gmail.com
    });
  }
}
