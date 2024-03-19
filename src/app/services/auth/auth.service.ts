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

  private handleAuthError(error: any) {
    let errorMessage = '';
    switch (error.code) {
      case 'auth/wrong-password':
        errorMessage =
          'Senha incorreta. Por favor, verifique suas credenciais e tente novamente.';
        break;
      case 'auth/user-not-found':
        errorMessage =
          'Usuário não encontrado. Por favor, verifique suas credenciais e tente novamente.';
        break;
      case 'auth/email-already-in-use':
        errorMessage =
          'O email fornecido já está em uso. Por favor, tente com outro email.';
        break;
      // Add other error cases as needed
      default:
        errorMessage =
          'Ocorreu um erro ao realizar a operação. Por favor, tente novamente.';
        break;
    }
    this.messageService.showErrorMessage(errorMessage);
    this.loadingUser = false;
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
      this.handleAuthError(error);
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
      this.handleAuthError(error);
    }
  }

  async googleSignin() {
    try {
      this.loadingUser = true;
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.auth.signInWithPopup(provider);
      this.user.next(credential.user);
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  async updateProfile(nomeUsuario: string, fotoPerfil: string) {
    try {
      this.loadingUser = true;
      const user = await this.auth.currentUser;
      if (user) {
        const credential = await user.updateProfile({
          displayName: nomeUsuario,
          // photoURL: fotoPerfil  > validar se a url está correta
        });
        this.loadingUser = false;
      } else {
        this.messageService.showErrorMessage(
          'Nenhum usuário está autenticado no momento.'
        );
        this.loadingUser = false;
      }
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  async signOut() {
    try {
      this.loadingUser = true;
      await this.auth.signOut();
      this.user.next(null);
    } catch (error) {
      this.handleAuthError(error);
    }
  }

  async deleteCurrentUser() {
    try {
      this.loadingUser = true;
      if (this.user.value) {
        await this.user.value.delete();
        this.user.next(null);
      } else {
        this.messageService.showErrorMessage(
          'Nenhum usuário está autenticado no momento.'
        );
      }
    } catch (error) {
      this.handleAuthError(error);
    }
  }
}
