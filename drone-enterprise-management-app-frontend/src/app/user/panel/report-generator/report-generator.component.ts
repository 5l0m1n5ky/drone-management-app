import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderViewComponent } from '../order-view/order-view.component';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OrderItem } from '../models/order-item.model';
import { GetBase64FontService } from './get-base64-font.service';
import { PanelService } from '../panel.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report-generator',
  standalone: true,
  imports: [CommonModule, OrderViewComponent],
  templateUrl: './report-generator.component.html'
})
export class ReportGeneratorComponent implements OnInit, OnDestroy {

  files: { file: File, fileUrl: string }[] = [];
  order: OrderItem[] | null;
  inspectionReport: Blob;
  inspectionReportFileName: string;
  uploadReportSubscription: Subscription;

  constructor(private orderViewComponent: OrderViewComponent, private getBase6FontService: GetBase64FontService, private panelService: PanelService) { }

  ngOnInit(): void {
    if (this.orderViewComponent.order && this.orderViewComponent.order?.length > 0) {
      this.order = this.orderViewComponent.order;
    } else {
      this.disableReportCreateMode();
    }
  }

  ngOnDestroy(): void {
    this.uploadReportSubscription?.unsubscribe();
  }

  convertToBase64(file: File): string {
    const reader = new FileReader();
    var encodedFile = "";
    reader.onload = (e: any) => {
      encodedFile = e.target.result
    };
    reader.readAsDataURL(file);
    return encodedFile
  };

  uploadFiles($event: any) {

    const files = $event.target.files as FileList;

    Array.from(files).forEach((file: File) => {

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.files.push({
          file: file,
          fileUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
    });

  }

  generatePdf() {

    const doc = new jsPDF();
    doc.addFileToVFS("RobotoRegular.ttf", this.getBase6FontService.getFontData());
    doc.addFont("RobotoRegular.ttf", "RobotoRegular", "normal");
    doc.setFont("RobotoRegular");
    doc.setFontSize(30)
    doc.text("RAPORT Z INSPEKCJI", 105, 100, { align: 'center' });
    doc.setFontSize(15)
    doc.text("Zlecenie#1212918141", 105, 110, { align: 'center' });
    doc.addPage("a4", "p");
    doc.setFontSize(20);
    doc.text("Dane inspekcji", 15, 20);

    if (this.order) {
      autoTable(doc, {
        body: [
          ['Nazwa zlecenia', this.order[0].alias.toString()],
          ['Rodaj zlecenia', this.order[0].service.toString()],
          ['Typ zlecenia', this.order[0].subservice.toString()],
          ['Ilość skojarzona z jednostką', this.order[0].amount.toString()],
          ['Długość geograficzna miejsca zlecenia', this.order[0].longitude.toString()],
          ['Szerokość geograficzna miejsca zlecenia', this.order[0].latitude.toString()],
          ['Data zlecenia', this.order[0].date.toString()],
          ['Klient', this.order[0].customerName.toString() + (this.order[0].customerSurname ? this.order[0].customerSurname.toString() : '')],
          ['Koszt [PLN]', this.order[0].price.toString()],
        ],
        margin: { top: 30, left: 15, right: 15 },
        styles: {
          font: 'RobotoRegular',
          fontStyle: 'normal'
        }
      });
    }

    doc.addPage('a4', 'p');
    for (let i = 0; i < this.files.length; i++) {
      if (i % 2 === 0) {
        doc.addImage(this.files[i].fileUrl, 'jpeg', 15, 15, 180, 120);
      } else if ((i % 2 !== 0) && (i === this.files.length - 1)) {
        doc.addImage(this.files[i].fileUrl, 'jpeg', 15, 150, 180, 120);
      } else if ((i % 2 !== 0) && (i !== this.files.length - 1)) {
        doc.addImage(this.files[i].fileUrl, 'jpeg', 15, 150, 180, 120);
        doc.addPage('a4', 'p');
      }
    }

    if (this.order) {
      this.inspectionReportFileName = 'Report' + this.order[0].alias.toString() + '_' + this.order[0].id.toString();
      this.inspectionReport = doc.output('blob');

      this.orderViewComponent.isProcessing = true;

      this.uploadReportSubscription = this.panelService.uploadInspectionReport(this.order[0].id, this.inspectionReport, this.inspectionReportFileName).subscribe(response => {
        this.files = [];
        this.orderViewComponent.toastService.generateToast('success', 'Generowanie raportu inspekcji', response.message);
        this.orderViewComponent.reportCreateMode = false;
        this.orderViewComponent.isProcessing = false;
      }, errorMessage => {
        this.files = [];
        this.orderViewComponent.toastService.generateToast('error', 'Generowanie raportu inspekcji', errorMessage);
        this.orderViewComponent.reportCreateMode = false;
        this.orderViewComponent.isProcessing = false;
      });

    } else {
      this.orderViewComponent.toastService.generateToast('error', 'Generowanie raportu inspekcji', 'Błąd przetwarzania danych');
    }
  }

  onGenerate() {
    this.generatePdf();
  }

  onFilesClear() {
    this.files = [];
  }

  disableReportCreateMode() {
    this.orderViewComponent.reportCreateMode = false;
  }

}
