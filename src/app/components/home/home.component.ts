import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  username: string = '';
  password: string = '';

  constructor() { }

  login() {
    window.alert(`Username: ${this.username} / Password: ${this.password}`)
  }
}
