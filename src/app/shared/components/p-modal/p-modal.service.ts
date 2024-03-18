import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { WarningComponent } from './warning/warning.component';

@Injectable({
  providedIn: 'root',
})
export class PModalService {
  constructor(public dialog: MatDialog) {}

  openDialog(modalComponent: ComponentType<any>, params = {}) {
    const enterAnimationDuration = '100ms';
    const exitAnimationDuration = '100ms';

    this.dialog.open(modalComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      data: params,
    });
  }
  openQuestionDialog(question: string, execute: () => void) {
    const enterAnimationDuration = '250ms';
    const exitAnimationDuration = '250ms';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      question,
      execute,
    };
    dialogConfig.enterAnimationDuration = enterAnimationDuration;
    dialogConfig.exitAnimationDuration = exitAnimationDuration;

    this.dialog.open(WarningComponent, dialogConfig);
  }
}
