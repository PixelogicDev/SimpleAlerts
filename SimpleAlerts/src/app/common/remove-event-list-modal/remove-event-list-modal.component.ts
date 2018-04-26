import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-remove-event-list-modal',
  templateUrl: './remove-event-list-modal.component.html'
})
export class RemoveEventListModalComponent {
  constructor(
    public dialogRef: MatDialogRef<RemoveEventListModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
