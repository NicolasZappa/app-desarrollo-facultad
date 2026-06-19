import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  resending = signal(false);
  resendMessage = '';
  resendError = '';

  async resend(): Promise<void> {
    this.resendMessage = '';
    this.resendError = '';
    this.resending.set(true);

    try {
      const res = await firstValueFrom(this.auth.resendVerification());
      this.resendMessage = res.message;
    } catch (err: any) {
      this.resendError = err.error?.message || 'Error al reenviar email';
    } finally {
      this.resending.set(false);
    }
  }
}
