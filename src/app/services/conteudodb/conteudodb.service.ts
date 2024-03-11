import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/compat/database';
import { ConteudoDb } from '../../interfaces/conteudo-db';
import { PMessageService } from '../../shared/components/p-message/p-message.service';
import { Observable, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConteudodbService {

  private conteudosRef: AngularFireList<ConteudoDb>;

  constructor(private db: AngularFireDatabase, private messageService: PMessageService) {
    this.conteudosRef = this.db.list('/conteudos');
  }

  // CRUD operations

  getConteudos(keyUsuario: string): Observable<ConteudoDb[]> {
    return of(keyUsuario).pipe(
      switchMap(uid => {
        if (!uid) {
          return of([]);
        } else {
          return this.db.list<ConteudoDb>('/conteudos', ref => ref.orderByChild('usuarioKey').equalTo(uid)).snapshotChanges().pipe(
            map((changes: SnapshotAction<ConteudoDb>[]) =>
              changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
            )
          );
        }
      })
    );
  }

  getConteudoById(id: string): Observable<ConteudoDb | null> {
    return this.db.object<ConteudoDb>('/conteudos/' + id).valueChanges();
  }

  addConteudo(conteudo: ConteudoDb): Promise<string | null> {
    return this.conteudosRef.push(conteudo)
      .then(ref => ref.key)
      .catch(error => {
        this.messageService.showErrorMessage("Erro ao adicionar conteudo: " + error);
        throw error;
      });
  }

  updateConteudo(id: string, novaConteudo: ConteudoDb): Promise<void> {
    return this.conteudosRef.update(id, novaConteudo)
      .catch(error => {
        this.messageService.showErrorMessage("Erro ao atualizar conteudo: " + error);
        throw error;
      });
  }

  deleteConteudo(id: string): Promise<void> {
    return this.conteudosRef.remove(id)
      .catch(error => {
        this.messageService.showErrorMessage("Erro ao excluir o conteudo: " + error);
        throw error;
      });
  }

  // Real-time event listeners

  // listenForConteudosChanges(): Observable<any> {
  //   return this.ConteudosRef.snapshotChanges();
  // }
}
