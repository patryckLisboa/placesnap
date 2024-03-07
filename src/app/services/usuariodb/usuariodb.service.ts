import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject, SnapshotAction } from '@angular/fire/compat/database';
import { UsuarioDb } from '../../interfaces/usuario-db';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UsuariodbService {
  private usuariosRef: AngularFireList<any>;

  usuarios: Observable<UsuarioDb[]>;

  constructor(private db: AngularFireDatabase) {
    this.usuariosRef = this.db.list('/usuarios');

    this.usuarios = this.usuariosRef.snapshotChanges().pipe(
      map((changes: SnapshotAction<UsuarioDb>[]) =>
        changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  // CRUD operations

  getUsuarios(): Observable<UsuarioDb[]> {
    return this.usuarios;
  }

  getUsuarioById(id: string): Observable<UsuarioDb | null> {
    return this.db.object<UsuarioDb>('/usuarios/' + id).valueChanges();
  }

  getUsuarioObservableById(id: string): AngularFireObject<UsuarioDb> {
    return this.db.object(`/usuarios/${id}`);
  }

  getUsuarioByEmail(email: string): Observable<UsuarioDb | null> {
    return this.db.list<UsuarioDb>('/usuarios', ref => ref.orderByChild('email').equalTo(email)).valueChanges()
      .pipe(
        map(usuarios => {
          if (usuarios && usuarios.length > 0) {
            return usuarios[0]; // Retorna o primeiro usuário encontrado com o email
          } else {
            return null; // Retorna null se nenhum usuário for encontrado com o email
          }
        })
      );
  }

  addUsuario(usuario: UsuarioDb): Promise<string | null> {
    const id = usuario.key; // Obtenha a chave do usuário
  
    return this.usuariosRef.update(id || '', usuario)
      .then(() => id) // Retorna a chave como prometido
      .catch(error => {
        console.error("Erro ao adicionar usuário: ", error);
        throw error;
      });
  }
  
  updateUsuario(id: string, novoUsuario: UsuarioDb): Promise<void> {
    return this.usuariosRef.update(id, novoUsuario)
      .catch(error => {
        console.error("Erro ao atualizar usuário: ", error);
        throw error;
      });
  }

  deleteUsuario(id: string): Promise<void> {
    return this.usuariosRef.remove(id)
      .catch(error => {
        console.error("Erro ao excluir usuário: ", error);
        throw error;
      });
  }

  // Real-time event listeners

  listenForUsuariosChanges(): Observable<SnapshotAction<UsuarioDb>[]>  {
    return this.usuariosRef.snapshotChanges();
  }
}
