import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import {
  faCoffee,
  faSignInAlt,
  faUserAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Subscription, first, firstValueFrom } from 'rxjs';
import { CompradbService } from '../../services/compradb/compradb.service';
import { CompraDb } from '../../interfaces/compra-db';
import { UsuarioDb } from '../../interfaces/usuario-db';
import { UsuariodbService } from '../../services/usuariodb/usuariodb.service';
import { PMessageService } from '../../shared/components/p-message/p-message.service';
import { SnapshotAction } from '@angular/fire/compat/database';
import { HomeService } from './service/home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(public homeService: HomeService) {}
  
  ngOnInit(){
    this.homeService.onInit();
  }

  ngOnDestroy(){
    this.homeService.onDestroy();
  }
}
