import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';
import firebase from 'firebase/compat/app';
import { UsuarioDb } from '../../interfaces/usuario-db';
import { PMessageService } from '../../shared/components/p-message/p-message.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: BehaviorSubject<any> = new BehaviorSubject(null);
  loadingUser = true;

  constructor(
    public auth: AngularFireAuth,
    private messageService: PMessageService
  ) {
    this.auth.authState.subscribe((user) => {
      if (user !== this.user.value) {
        this.user.next(user);
      }
      this.loadingUser = false;
    });
  }

  async emailSignin(email: string, password: string) {
    try {
      this.loadingUser = true;
      const credential = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      this.user.next(credential.user);
    } catch (error) {
      this.messageService.showErrorMessage(
        'Ocorreu um erro ao fazer login. Por favor, verifique suas credenciais e tente novamente.'
      );
    }
  }

  async emailSignup(email: string, password: string) {
    try {
      this.loadingUser = true;
      const credential = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      this.user.next(credential.user);
    } catch (error) {
      this.messageService.showErrorMessage(
        'Ocorreu um erro ao criar a conta. Por favor, tente novamente mais tarde.'
      );
    }
  }

  async googleSignin() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      this.loadingUser = true;
      const credential = await this.auth.signInWithPopup(provider);
      this.user.next(credential.user);
    } catch (error) {
      this.messageService.showErrorMessage(
        'Ocorreu um erro ao fazer login com o Google. Por favor, tente novamente.'
      );
    }
  }

  async updateProfile(usuario: UsuarioDb) {
    try {
      const user: any = this.auth.currentUser;
      if (user) {
        const { nome, telefone1, telefone2, nivel_permissao } = usuario;
        await user.updateProfile({
          displayName: nome || null,
          phoneNumber: telefone1 || null,
          customMetadata: {
            telefone2: telefone2 || null,
            nivel_permissao: nivel_permissao || null,
          },
        });
      } else {
        this.messageService.showErrorMessage(
          'Nenhum usuário está autenticado no momento.'
        );
      }
    } catch (error) {
      this.messageService.showErrorMessage(
        'Ocorreu um erro ao atualizar seus dados de usuário. Por favor, tente novamente.'
      );
    }
  }

  async signOut() {
    try {
      await this.auth.signOut();
      this.user.next(null);
    } catch (error) {
      this.messageService.showErrorMessage(
        'Ocorreu um erro ao sair. Por favor, tente novamente.'
      );
    }
  }

  async deleteCurrentUser() {
    try {
      if (this.user.value) {
        await this.user.value.delete();
        this.user.next(null);
      } else {
        throw new Error('Nenhum usuário está autenticado no momento.');
      }
    } catch (error) {
      this.messageService.showErrorMessage(
        'Ocorreu um erro ao excluir a conta. Por favor, tente novamente.'
      );
    }
  }
}
