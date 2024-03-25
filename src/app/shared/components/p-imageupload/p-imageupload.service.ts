import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PImageuploadService {
  private imageUrlSubject: Subject<string> = new Subject<string>();
  imageUrl$: Observable<string> = this.imageUrlSubject.asObservable();

  constructor(private storage: AngularFireStorage) {}

  async uploadImage(email: string, selectedFile: File): Promise<string | null> {
    if (!email || !selectedFile) {
      console.error('Email or selected file is null.');
      return null;
    }
    console.log(selectedFile.name)
    let fileName = selectedFile.name;
    if (fileName === 'undefined') {
      fileName = 'unknown_file';
    }

    const filePath = `images/${email}/${Date.now()}_${fileName}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, selectedFile);

    return new Promise<string | null>((resolve, reject) => {
      uploadTask
        .snapshotChanges()
        .pipe(
          finalize(() => {
            fileRef.getDownloadURL().subscribe((url) => {
              if (!url) {
                console.error('Failed to get download URL.');
                resolve(null);
              } else {
                this.imageUrlSubject.next(url);
                resolve(url);
              }
            });
          })
        )
        .subscribe();
    });
  }
}
