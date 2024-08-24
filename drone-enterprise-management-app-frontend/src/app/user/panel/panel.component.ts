import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from 'src/app/sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-panel',
  templateUrl: './panel.component.html',
  imports: [
    RouterOutlet,
    SidebarComponent
  ]
})
export class PanelComponent {

}
