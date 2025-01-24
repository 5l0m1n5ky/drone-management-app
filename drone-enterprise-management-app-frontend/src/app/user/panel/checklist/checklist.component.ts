import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, NgForm } from '@angular/forms';
import { OrderViewComponent } from '../order-view/order-view.component';
import { PanelService } from '../panel.service';
import { Checklist } from '../models/checklist.model';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [CommonModule, MatCheckboxModule, FormsModule, OrderViewComponent],
  templateUrl: './checklist.component.html',
})
export class ChecklistComponent implements OnInit {

  constructor(private orderViewComponent: OrderViewComponent, private panelService: PanelService) { }

  checklist: Checklist[];

  ngOnInit(): void {
    this.checklist = this.orderViewComponent.checklist;

    if (this.checklist.length === 0) {
      this.closeChecklist();
    }
  }

  closeChecklist() {
    this.orderViewComponent.closeCheclist();
  }

  onChecklistUpdate(checklist: NgForm) {
    this.orderViewComponent.onChecklistUpdate(checklist);
  }
}
