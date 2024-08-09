import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

type severityTypes = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast'

@Injectable()
export class ToastService {

  constructor(private messageService: MessageService) { }

  generateToast(severity: severityTypes, summary: string, detail: string, ttl: number = 3000) {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail,
      life: ttl
    });
  }
}
