import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { State } from '../../models/state.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface data {
  states: State[],
  orderId: Number
}

interface dataToRetrieve {
  data: data
}

@Component({
  selector: 'app-bottom-panel',
  standalone: true,
  imports: [CommonModule, MatListModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './bottom-panel.component.html',
})
export class BottomPanelComponent implements OnInit {

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: dataToRetrieve) { }

  states: State[] = [];
  orderId: Number;

  stateForm: FormGroup;

  ngOnInit(): void {

    this.stateForm = new FormGroup({
      comment: new FormControl(null),
      stateId: new FormControl(null, Validators.required),
    });

    this.states = [...this.data.data.states];
    this.orderId = this.data.data.orderId;

    console.log('states: ', this.states);
    console.log('id: ', this.orderId);

  }

  onStateModifySubmit() {
  }

}
