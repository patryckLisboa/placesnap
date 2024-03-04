import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject, SnapshotAction } from '@angular/fire/compat/database';
import { CompraDb } from '../../interfaces/compra-db';
import { Observable, lastValueFrom, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PMessageService } from '../../shared/components/p-message/p-message.service';

@Injectable({
  providedIn: 'root',
})
export class CompradbService {
  private comprasRef: AngularFireList<CompraDb>;

  constructor(private db: AngularFireDatabase, private messageService: PMessageService) {
    this.comprasRef = this.db.list('/compras');
  }

  // CRUD operations

  getCompras(keyUsuario: string): Observable<CompraDb[]> {
    return of(keyUsuario).pipe(
      switchMap(uid => {
        if (!uid) {
          return of([]);
        } else {
          return this.db.list<CompraDb>('/compras', ref => ref.orderByChild('usuarioKey').equalTo(uid)).snapshotChanges().pipe(
            map((changes: SnapshotAction<CompraDb>[]) =>
              changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
            )
          );
        }
      })
    );
  }

  getCompraById(id: string): Observable<CompraDb | null> {
    return this.db.object<CompraDb>('/compras/' + id).valueChanges();
  }

  addCompra(compra: CompraDb): Promise<string | null> {
    return this.comprasRef.push(compra)
      .then(ref => ref.key)
      .catch(error => {
        this.messageService.showErrorMessage("Erro ao adicionar compra: " + error);
        throw error;
      });
  }

  updateCompra(id: string, novaCompra: CompraDb): Promise<void> {
    return this.comprasRef.update(id, novaCompra)
      .catch(error => {
        this.messageService.showErrorMessage("Erro ao atualizar compra: " + error);
        throw error;
      });
  }

  deleteCompra(id: string): Promise<void> {
    return this.comprasRef.remove(id)
      .catch(error => {
        this.messageService.showErrorMessage("Erro ao excluir compra: " + error);
        throw error;
      });
  }

  // Real-time event listeners

  // listenForComprasChanges(): Observable<any> {
  //   return this.comprasRef.snapshotChanges();
  // }

}
