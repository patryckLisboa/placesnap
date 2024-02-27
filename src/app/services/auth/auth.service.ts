import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { Observable, firstValueFrom, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { first } from 'rxjs/operators';

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
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;
  error: any;
  usuariosRef: any;
  usuarios$: Observable<UsuarioDB[]> = of([]);

  constructor(
    public auth: AngularFireAuth,
    private dataBase: AngularFireDatabase
  ) {
    this.auth.authState.subscribe((user) => {
      this.user = user;
      if (user) this.getUsuarios();
    });
  }

  getUsuarios() {
    if (this.usuariosRef) return;
    this.usuariosRef = this.dataBase.database.ref('usuarios');
    this.usuariosRef
      .once('value')
      .then((snapshot: any) => {
        const usuarios: UsuarioDB[] = [];
        snapshot.forEach((childSnapshot: any) => {
          usuarios.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        this.usuarios$ = of(usuarios);
      })
      .catch((error: any) => {
        console.error('Erro ao buscar usuários:', error);
        this.usuarios$ = of([]);
      });
  }

  async emailSignin(email: string, password: string) {
    try {
      const credential = await this.auth.signInWithEmailAndPassword(
        email,
        password
      );
      this.user = credential.user;

      if (!(await this.getUsuarioCurrent())) {
        console.log('Usuário não encontrado na base. Adicionando...');
        await this.addUsuario(
          credential.user?.uid,
          email,
          credential.user?.displayName,
          credential.user?.phoneNumber
        );
        return;
      }
      console.log('Usuário encontrado na base. Não é necessário adicionar.');
    } catch (error) {
      this.error = error;
    }
  }

  async emailSignup(email: string, password: string) {
    try {
      const credential = await this.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      this.user = credential.user;
      await this.addUsuario(
        credential.user?.uid,
        email,
        credential.user?.displayName,
        credential.user?.phoneNumber
      );
    } catch (error) {
      this.error = error;
    }
  }

  async googleSignin() {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const credential = await this.auth.signInWithPopup(provider);
      this.user = credential.user;

      if (!(await this.getUsuarioCurrent())) {
        console.log('Usuário não encontrado na base. Adicionando...');
        await this.addUsuario(
          credential.user?.uid,
          credential.user?.email,
          credential.user?.displayName,
          credential.user?.phoneNumber
        );
        return;
      }
      console.log('Usuário encontrado na base. Não é necessário adicionar.');
    } catch (error) {
      this.error = error;
    }
  }

  async signOut() {
    await this.auth.signOut();
    this.user = null;
  }

  async deleteCurrentUser() {
    try {
      if (this.user) {
        await this.user.delete();
        await this.removeUsuario(this.user.uid);
        return (this.user = null);
      }
      throw new Error('No user is currently authenticated.');
    } catch (error) {
      this.error = error;
      return;
    }
  }

  addUsuario(uid: any, email: any, nome: any, telefone: any) {
    this.usuariosRef.push({
      id: uid,
      email,
      nome_login: email,
      nome,
      telefone1: telefone,
      telefone2: '',
      nivel_permissao: 1,
    });
  }

  async removeUsuario(id: string): Promise<void> {
    try {
      const usuarios = await this.usuarios$.pipe(first()).toPromise();

      const usuarioParaRemover = usuarios?.find((usuario) => usuario.id === id);

      if (usuarioParaRemover) {
        const snapshot: any[] = await this.usuariosRef
          .orderByChild('id')
          .equalTo(id)
          .once('value');
        snapshot.forEach((childSnapshot) => {
          childSnapshot.ref.remove();
        });
      } else {
        console.error('Usuário não encontrado para o ID fornecido:', id);
      }
    } catch (error) {
      console.error('Erro ao remover usuário:', error);
      throw error; // Lançar o erro para ser tratado por quem chamou o método, se necessário
    }
  }

  async getUsuarioCurrent() {
    const usuarios: any[] = await this.getUsuariosRaltime();
    if (!this.user) return;
    return usuarios.find((usuario) => usuario.id === this.user.uid);
  }

  async getUsuariosRaltime(): Promise<UsuarioDB[]> {
    try {
      if (!this.usuariosRef) return [];

      const snapshot = await this.usuariosRef.once('value');
      const usuarios: UsuarioDB[] = [];
      snapshot.forEach((childSnapshot: any) => {
        usuarios.push({ id: childSnapshot.key, ...childSnapshot.val() });
      });
      return usuarios;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      return []; // Retorna um array vazio em caso de erro
    }
  }

  async teste() {
    try {
      const usuarios: any = await this.getUsuariosRaltime();
      console.log(this.user);
      usuarios.forEach((usuario: UsuarioDB) => {
        console.log(usuario);
      });
    } catch (error) {
      console.error('Erro ao listar usuários:', error);
    }
  }
}
