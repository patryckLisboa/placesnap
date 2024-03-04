import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PMessageComponent } from './p-message.component';

@Injectable({
  providedIn: 'root',
})
export class PMessageService {

  constructor(private snackBar: MatSnackBar) {}

  showErrorMessage(message: string) {
    this.snackBar.openFromComponent(PMessageComponent, {
      duration: 10000,
      panelClass: ['error-snackbar'],
      data: { message: message }
    });
  }

  showSuccessMessage(message: string) {
    this.snackBar.openFromComponent(PMessageComponent, {
      duration: 10000,
      panelClass: ['success-snackbar'],
      data: { message: message }
    });
  }

  showWarningMessage(message: string) {
    this.snackBar.openFromComponent(PMessageComponent, {
      duration: 10000,
      panelClass: ['warning-snackbar'],
      data: { message: message }
    });
  }

  dismiss() {
    this.snackBar.dismiss();
  }
}
