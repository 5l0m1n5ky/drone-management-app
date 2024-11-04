import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderViewComponent } from '../order-view/order-view.component';
import { FileUploadEvent, FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'app-report-generator',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: './report-generator.component.html'
})
export class ReportGeneratorComponent {

  onSelect($event: any) {
    console.log('on select');
  }

  onUpload($event: any) {
    console.log('on upload');
  }

  constructor(private orderViewComponent: OrderViewComponent) { }

  disableReportCreateMode() {
    this.orderViewComponent.reportCreateMode = false;
  }

}
