import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactService } from './contact.service';
import { LoadingSpinnerComponent } from '../shared/loading-spinner/loading-spinner.component';
import { ToastModule } from 'primeng/toast';
import { ToastService } from '../shared/toast/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, NavbarComponent, MatInputModule, MatFormFieldModule, ReactiveFormsModule, LoadingSpinnerComponent, ToastModule],
  templateUrl: './contact.component.html',
})

export class ContactComponent implements OnInit, OnDestroy {

  constructor(private contactService: ContactService, private toastService: ToastService) { }

  contactForm: FormGroup;
  isProcessing: boolean = false;
  sendMessageSubscription: Subscription;

  ngOnInit(): void {

    this.contactForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      subject: new FormControl(null, Validators.required),
      content: new FormControl(null, Validators.required),
    });
  }

  onMessageSend() {
    this.contactForm.reset();

    this.isProcessing = true;
    this.sendMessageSubscription = this.contactService.sendMessage(
      this.contactForm.get('email')?.value,
      this.contactForm.get('subject')?.value,
      this.contactForm.get('content')?.value
    ).subscribe(response => {
      this.isProcessing = false;
      this.toastService.generateToast('success', 'Przesyłanie wiadomości', response.data);
    }, errorMessage => {
      this.isProcessing = false;
      this.toastService.generateToast('error', 'Przesyłanie wiadomości', errorMessage);
    });
  }

  ngOnDestroy(): void {
    if (this.sendMessageSubscription) {
      this.sendMessageSubscription.unsubscribe();
    }
  }
}
