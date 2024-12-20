import { Component, inject } from '@angular/core';
import { AuthStore } from '../../core/stores/user-store/auth.store';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
})
export default class DashboardComponent {
  protected userStore = inject(AuthStore);
  protected user = this.userStore.currentUser;
}
