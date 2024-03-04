// p-message.component.ts

import { Component, Inject } from '@angular/core';
import { PMessageService } from './p-message.service';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-p-message',
  templateUrl: './p-message.component.html',
  styleUrls: ['./p-message.component.scss'],
})
export class PMessageComponent {

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string },
    public messageService: PMessageService
  ) {}

  ngOnInit(): void {}
}
