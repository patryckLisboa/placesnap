import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import {
  faCoffee,
  faSignInAlt,
  faUserAlt,
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { PSnackBarComponent } from './p-snack-bar/p-snack-bar.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  AngularFireDatabase,
  SnapshotAction,
} from '@angular/fire/compat/database';

export interface UsuarioDB {
  id: string;
  email: string;
  nome_login: string;
  nome: string;
  telefone1: string;
  telefone2: string;
  nivel_permissao: number;
}

export interface CompraDB {
  id: string;
  dataefetivacao: Date;
  usuario: UsuarioDB;
}

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

  comprasRef: any;
  compras: Observable<CompraDB[]> = new Observable();

  constructor(
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    private dataBase: AngularFireDatabase
  ) {}

  ngAfterViewInit() {
    setInterval(() => {
      const user = this.authService.user;
      if (user) this.getComprasByUsuario(); // Chame sua função com o valor do usuário
    }, 500); // Intervalo de meio segundo (500 milissegundos)
  }

  // getCompras(){
  //   this.comprasRef = this.dataBase.list('compras');
  //   this.compras = this.comprasRef
  //     .snapshotChanges()
  //     .pipe(
  //       map((changes: SnapshotAction<CompraDB>[]) =>
  //         changes.map((c) => ({ id: c.payload.key, ...c.payload.val() }))
  //       )
  //     );
  // }

  async getComprasByUsuario() {
    const usuario: any = await this.authService.getUsuarioCurrent();

    this.compras.subscribe((compras: CompraDB[]) => {
      const compraEncontrada = compras.some(
        (compra) => compra.usuario.id === usuario.id
      );

      if (!compraEncontrada) {
        this.listarComprasByUsuario(usuario);
      }
    });
    if (!this.comprasRef) {
      this.listarComprasByUsuario(usuario);
    }
  }

  listarComprasByUsuario(usuario: any) {
    if(!usuario) return
    if(!this.authService.user) return

    this.comprasRef = this.dataBase.list('compras', (ref) =>
      ref.orderByChild('usuario/id').equalTo(usuario.id)
    );

    this.compras = this.comprasRef
      .snapshotChanges()
      .pipe(
        map((changes: SnapshotAction<CompraDB>[]) =>
          changes.map((c) => ({ id: c.payload.key, ...c.payload.val() }))
        )
      );
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
    this.getComprasByUsuario();

    if (this.authService.error) {
      return this.openSnackBar(this.authService.error);
    }
  }

  async googleSignin() {
    await this.authService.googleSignin();
    this.getComprasByUsuario();

    if (this.authService.error) {
      return this.openSnackBar(this.authService.error);
    }
  }

  async addCompra() {
    const usuario: any = await this.authService.getUsuarioCurrent();

    this.comprasRef.push({
      dataefetivacao: new Date().toJSON(),
      usuario: usuario,
      teste: 'estdaffd',
    });
  }

  removeCompra(id: string) {
    this.comprasRef.remove(id);
  }

  logOut() {
    this.loginFormGroup.reset();
    this.comprasRef = null;
    this.compras = new Observable<CompraDB[]>();
    this.authService.signOut();
  }

  teste() {
    console.log(this.authService.user);
    this.compras.forEach((element) => {
      console.log(element);
    });

    this.openSnackBar('dfadfadf');
  }

  openSnackBar(message = '') {
    const snackBarRef: MatSnackBarRef<PSnackBarComponent> =
      this._snackBar.openFromComponent(PSnackBarComponent, {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'center',
      });
    snackBarRef.instance.data = { message };
  }
}
