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
  key: string;
  email: string;
  nome_login: string;
  nome: string;
  telefone1: string;
  telefone2: string;
  nivel_permissao: number;
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

  listRef: any;
  list: Observable<UsuarioDB[]>;

  constructor(
    public authService: AuthService,
    private _snackBar: MatSnackBar,
    private dataBase: AngularFireDatabase
  ) {
    this.listRef = dataBase.list('list');
    this.list = this.listRef
      .snapshotChanges()
      .pipe(
        map((changes: SnapshotAction<UsuarioDB>[]) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
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
    if (this.authService.error) {
      this.openSnackBar(this.authService.error);
    }
  }

  addCliente() {
    console.log('teet');
    this.listRef.push({
      email: this.loginFormGroup.get('emailFormControl').value,
      nome_login: this.loginFormGroup.get('emailFormControl').value,
      nome: this.loginFormGroup.get('nome').value,
      telefone1: '62991233755',
      telefone2: '62991233753',
      nivel_permissao: 1,
    });
  }

  removeCliente(key: string) {
    this.listRef.remove(key);
  }

  teste() {
    console.log(this.authService.user);
    this.list.forEach((element) => {
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
