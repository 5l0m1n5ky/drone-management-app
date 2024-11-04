import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { jsPDF } from "jspdf";
import { HttpClient } from '@angular/common/http';
import { FileUploadModule } from 'primeng/fileupload';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-pdf',
  standalone: true,
  imports: [CommonModule, FileUploadModule],
  templateUrl: './pdf.component.html',
})
export class PdfComponent {

  files: { file: File, fileUrl: string }[] = [];

  constructor(private http: HttpClient) { }

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
    doc.setFont("helvetica", "normal");
    doc.setFontSize(30)
    doc.text("RAPORT Z INSPEKCJI", 105, 100, { align: 'center' });
    doc.setFontSize(15)
    doc.text("Zlecenie#1212918141", 105, 110, { align: 'center' });
    doc.addPage("a4", "p");
    doc.setFontSize(20);
    doc.text("Dane inspekcji", 15, 20);

    autoTable(doc, {
      body: [
        ['Nazwa zlecenia', 'Zlecenie#12129181'],
        ['Rodaj zlecenia', 'Inspekcja PV'],
      ],
      margin: { top: 30, left: 15, right: 15 },
    })
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

    doc.save('dataurlnewwindow.pdf');
  }

  onGenerate() {
    this.generatePdf();
  }

  onFilesClear() {
    this.files = [];
  }

}






