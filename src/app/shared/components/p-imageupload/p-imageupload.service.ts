import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, Subject, finalize, firstValueFrom } from 'rxjs';
import { ImagestorageService } from '../../../services/imagestorage/imagestorage.service';
import { PMessageService } from '../p-message/p-message.service';

@Injectable({
  providedIn: 'root',
})
export class PImageuploadService {
  constructor(
    private imagestorageService: ImagestorageService,
    private pMessageService: PMessageService
  ) {}

  async uploadImage(email: string, selectedFile: File): Promise<string | null> {
    try {
      await this.imagestorageService.deleteAllImagesInFolder(`arquivos/${email}/imagens/perfil/`);
      const imageUrl = await firstValueFrom(
        this.imagestorageService.uploadImage(email, selectedFile)
      );
      if (imageUrl) {
        return imageUrl || null;
      } else {
        this.pMessageService.showErrorMessage(
          'Erro ao tentar fazer o upload da imagem'
        );
        return null;
      }
    } catch (error) {
      this.pMessageService.showErrorMessage(
        'Erro ao tentar fazer o upload da imagem:' + error
      );
      return null;
    }
  }
}
