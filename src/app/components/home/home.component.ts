import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import {
  faCoffee,
  faSignInAlt,
  faUserAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Subscription } from 'rxjs';
import { CompradbService } from '../../services/compradb/compradb.service';
import { CompraDb } from '../../interfaces/compra-db';
import { UsuarioDb } from '../../interfaces/usuario-db';
import { UsuariodbService } from '../../services/usuariodb/usuariodb.service';
import { PMessageService } from '../../shared/components/p-message/p-message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  faCoffee = faCoffee;
  faSignInAlt = faSignInAlt;
  faGoogle = faGoogle;
  faUserAlt = faUserAlt;

  loginFormGroup: any = new FormGroup({
    emailFormControl: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    passwordFormControl: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    nome_login: new FormControl(null),
    nome: new FormControl(null),
    telefone1: new FormControl(null),
    telefone2: new FormControl(null),
  });

  userAuth: any;
  userAuthSubscription: Subscription | undefined;
  compras: CompraDb[] = [];
  comprasSubscription: Subscription | undefined;

  constructor(
    public authService: AuthService,
    public compraDbService: CompradbService,
    public usuariosDbService: UsuariodbService,
    public messageService: PMessageService,

  ) {}

  ngOnInit() {
    this.userAuthSubscription = this.authService.user.subscribe((user) => {
      this.userAuth = user;
      if(this.userAuth){
        this.consultarCompras()
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userAuthSubscription) {
      this.userAuthSubscription.unsubscribe();
    }
    if (this.comprasSubscription) {
      this.comprasSubscription.unsubscribe();
    }
  }

  consultarCompras(){
    this.comprasSubscription = this.compraDbService
    .getCompras(this.userAuth?.uid)
    .subscribe((compras: CompraDb[]) => {
      this.compras = compras;
    });
  }

  login() {
    window.alert(
      `Username: ${
        this.loginFormGroup.get('emailFormControl').value
      } / Password: ${this.loginFormGroup.get('passwordFormControl').value}`
    );
  }

  async emailSignin() {
    await this.authService.emailSignin(
      this.loginFormGroup.get('emailFormControl').value,
      this.loginFormGroup.get('passwordFormControl').value
    );
  }

  async emailSignup() {
    await this.authService.emailSignup(
      this.loginFormGroup.get('emailFormControl').value,
      this.loginFormGroup.get('passwordFormControl').value
    );
  }

  async googleSignin() {
    await this.authService.googleSignin();
  }

  async addCompra() {
    this.compraDbService.addCompra({
      dataefetivacao: new Date().toJSON(),
      usuarioKey: this.userAuth.uid,
    } as CompraDb);
  }

  removeCompra(key: string) {
    this.compraDbService.deleteCompra(key);
  }

  async logOut() {
    await this.authService.signOut();
    this.loginFormGroup.reset();
  }

  async deleteCurrentUser(){
    await this.limparComprasUsuario()
    await this.authService.deleteCurrentUser();
    this.loginFormGroup.reset();
  }

  async limparComprasUsuario(): Promise<void>{
    try {
      const promises: Promise<void>[] = [];
      this.compras.forEach(compra => {
        promises.push(this.compraDbService.deleteCompra(compra.key || '').catch(error => {
          this.messageService.showErrorMessage(`Erro ao excluir compra ${compra.key}: `+ error);
          throw error;
        }));
      });
      
      await Promise.all(promises); 
    } catch (error) {
      this.messageService.showErrorMessage("Erro ao limpar compras do usuário: " + error);
      throw error;
    }
  }

  teste() {}
}
