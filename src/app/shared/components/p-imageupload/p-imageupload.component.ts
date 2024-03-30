import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-p-imageupload',
  templateUrl: './p-imageupload.component.html',
  styleUrls: ['./p-imageupload.component.scss'],
})
export class PImageuploadComponent {
  faUserAlt = faUserAlt;

  @Input() initialUrl: string = '';
  @Input() clickable: boolean = true;

  @Output() handleImgUrl: EventEmitter<File | null> =
    new EventEmitter<File | null>();
  imageUrl: string | null = null;
  urlImageToSave: any;

  get circleContainerStyle() {
    return this.clickable ? {
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      overflow: "hidden",
      border: "5px double #c9d6ff",
    } : {
      width: "300px",
      height: "300px",
      borderRadius: "50%",
      overflow: "hidden",
      border: "10px double #c9d6ff",
    };
  }
  
  onFileSelected(event: any) {
    if (event.target.files.length) {
      const selectedFile: File = event.target.files[0];
      const src = URL.createObjectURL(selectedFile);
      this.imageUrl = src;
      this.urlImageToSave = selectedFile;
      this.handleImgUrl.emit(selectedFile);
    }
  }
}
