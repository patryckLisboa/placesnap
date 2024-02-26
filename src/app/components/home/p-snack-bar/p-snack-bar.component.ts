import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-p-snack-bar',
  templateUrl: './p-snack-bar.component.html',
  styleUrls: ['./p-snack-bar.component.scss']
})
export class PSnackBarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<PSnackBarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) { }

  getData(){
    return this.data?.message
  }
}
