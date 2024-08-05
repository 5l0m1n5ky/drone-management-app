import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-cancel-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './cancel-dialog.component.html',
  styleUrls: ['./cancel-dialog.component.css']
})
export class CancelDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}
