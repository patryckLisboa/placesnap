import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { PImageuploadService } from './p-imageupload.service';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-p-imageupload',
  templateUrl: './p-imageupload.component.html',
  styleUrls: ['./p-imageupload.component.scss']
})
export class PImageuploadComponent {
  faUserAlt = faUserAlt;

  @Input() initialUrl: string = '';
  @Input() clickable: boolean = true;

  @Output() handleImgUrl: EventEmitter<File | null> = new EventEmitter<File | null>();
  imageUrl: string | null = null;
  urlImageToSave: any;
  
  onFileSelected(event: any) {
    if (event.target.files.length) {
      const selectedFile: File = event.target.files[0];
      const src = URL.createObjectURL(selectedFile);
      this.imageUrl = src;
      this.urlImageToSave = selectedFile
      this.handleImgUrl.emit(selectedFile);
    }
  }

}
