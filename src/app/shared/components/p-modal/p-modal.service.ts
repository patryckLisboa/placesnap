import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root'
})
export class PModalService {

  constructor(public dialog: MatDialog) {}

  openDialog(modalComponent:  ComponentType<any>, params = {}) {
    const enterAnimationDuration = '100ms'
    const exitAnimationDuration = '100ms'

    this.dialog.open(modalComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
      data: params 
    });
  }

}
