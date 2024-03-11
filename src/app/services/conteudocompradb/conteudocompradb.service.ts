import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, SnapshotAction } from '@angular/fire/compat/database';
import { ConteudocompraDb } from '../../interfaces/conteudocompra-db';
import { PMessageService } from '../../shared/components/p-message/p-message.service';
import { Observable, map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConteudocompradbService {

  private conteudocomprasRef: AngularFireList<ConteudocompraDb>;

  constructor(private db: AngularFireDatabase, private messageService: PMessageService) {
    this.conteudocomprasRef = this.db.list('/conteudocompras');
  }

  // CRUD operations

  getConteudocomprasConteudo(keyConteudo: string): Observable<ConteudocompraDb[]> {
    return of(keyConteudo).pipe(
      switchMap(uid => {
        if (!uid) {
          return of([]);
        } else {
          return this.db.list<ConteudocompraDb>('/conteudocompras', ref => ref.orderByChild('conteudoKey').equalTo(uid)).snapshotChanges().pipe(
            map((changes: SnapshotAction<ConteudocompraDb>[]) =>
              changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
            )
          );
        }
      })
    );
  }

  getConteudocomprasCompra(keyCompra: string): Observable<ConteudocompraDb[]> {
    return of(keyCompra).pipe(
      switchMap(uid => {
        if (!uid) {
          return of([]);
        } else {
          return this.db.list<ConteudocompraDb>('/conteudocompras', ref => ref.orderByChild('compraKey').equalTo(uid)).snapshotChanges().pipe(
            map((changes: SnapshotAction<ConteudocompraDb>[]) =>
              changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
            )
          );
        }
      })
    );
  }


  getConteudocompraById(id: string): Observable<ConteudocompraDb | null> {
    return this.db.object<ConteudocompraDb>('/conteudocompras/' + id).valueChanges();
  }

  addConteudocompra(conteudocompra: ConteudocompraDb): Promise<string | null> {
    return this.conteudocomprasRef.push(conteudocompra)
      .then(ref => ref.key)
      .catch(error => {
        this.messageService.showErrorMessage("Erro ao adicionar compra do conteudo: " + error);
        throw error;
      });
  }

  updateConteudocompra(id: string, novoConteudocompra: ConteudocompraDb): Promise<void> {
    return this.conteudocomprasRef.update(id, novoConteudocompra)
      .catch(error => {
        this.messageService.showErrorMessage("Erro ao atualizar compra do conteudo: " + error);
        throw error;
      });
  }

  deleteConteudocompra(id: string): Promise<void> {
    return this.conteudocomprasRef.remove(id)
      .catch(error => {
        this.messageService.showErrorMessage("Erro ao excluir a compra do conteudo: " + error);
        throw error;
      });
  }

  // Real-time event listeners

  // listenForConteudocomprasChanges(): Observable<any> {
  //   return this.ConteudocomprasRef.snapshotChanges();
  // }
}
