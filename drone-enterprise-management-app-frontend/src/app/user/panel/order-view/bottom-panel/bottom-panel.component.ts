import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { State } from '../../models/state.model';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelService } from '../../panel.service';
import { OrderViewComponent } from '../order-view.component';

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

  constructor(@Inject(MAT_BOTTOM_SHEET_DATA) public data: dataToRetrieve, private bottomPanelRef: MatBottomSheetRef<BottomPanelComponent>) { }

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

  }

  onStateModifySubmit() {

    console.log('order id: ', this.orderId);
    console.log('state id: ', this.stateForm.get('stateId')?.value);
    console.log('comment: ', this.stateForm.get('comment')?.value);

    // this.orderView.onStateModify(this.orderId, this.stateForm.get('stateId')?.value, this.stateForm.get('comment')?.value);

    const dataToPassBack = { orderId: this.orderId, stateId: this.stateForm.get('stateId')?.value, comment: this.stateForm.get('comment')?.value };

    this.bottomPanelRef.dismiss(dataToPassBack);
  }

}
