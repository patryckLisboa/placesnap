import { Injectable } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import {
  Observable,
  catchError,
  finalize,
  firstValueFrom,
  from,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImagestorageService {
  constructor(private storage: AngularFireStorage) {}

  uploadImage(email: string, selectedFile: File): Observable<string> {
    if (!email || !selectedFile) {
      console.error('Email or selected file is null.');
      return new Observable<string>((observer) => {
        observer.error('Email or selected file is null.');
        observer.complete();
      });
    }

    const fileName = selectedFile.name || 'unknown_file';
    const filePath = `arquivos/${email}/imagens/perfil/${Date.now()}_${fileName}`;
    const uploadTask: AngularFireUploadTask = this.storage.upload(
      filePath,
      selectedFile
    );

    return new Observable<string>((observer) => {
      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(async () => {
            const url = await firstValueFrom(
              this.storage.ref(filePath).getDownloadURL()
            );
            observer.next(url);
            observer.complete();
          })
        )
        .subscribe();
    });
  }

  deleteImage(imageUrl: string): Observable<void> {
    const storageRef = this.storage.refFromURL(imageUrl);
    return storageRef.delete();
  }

  async deleteAllImagesInFolder(folderPath: string): Promise<void> {
    const storageRef = this.storage.ref(folderPath);
    const result = await firstValueFrom(storageRef.listAll());
    await Promise.all(
      result.items.map(async (itemRef) => {
        await itemRef.delete();
      })
    );
  }
}
