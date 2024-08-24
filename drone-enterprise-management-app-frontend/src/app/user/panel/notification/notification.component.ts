import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';



@Component({
  standalone: true,
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  imports: [MatExpansionModule]
})
export class NotificationComponent {

}
