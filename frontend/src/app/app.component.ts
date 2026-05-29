import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/services/toast.component';
import { ModalComponent } from './shared/services/modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastComponent, ModalComponent],
  template: `
    <router-outlet></router-outlet>
    <app-toasts></app-toasts>
    <app-modal></app-modal>
  `
})
export class AppComponent {
  title = 'frontend';
}
