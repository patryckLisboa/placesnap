import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/compat/database';
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

  addUsuario(usuario: UsuarioDb): Promise<string | null> {
    return this.usuariosRef.push(usuario)
      .then(ref => ref.key)
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

  listenForUsuariosChanges(): Observable<any> {
    return this.usuariosRef.snapshotChanges();
  }
}
