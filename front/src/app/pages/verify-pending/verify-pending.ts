import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-pending',
  imports: [RouterLink],
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
})
export class VerifyPendingPage {
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  message = '';
  error = '';

  async resend(): Promise<void> {
    this.error = '';
    this.message = '';
    this.loading.set(true);

    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    try {
      const res = await firstValueFrom(this.auth.resendVerification());
      this.message = res.message;
    } catch (err: any) {
      this.error = err.error?.message || 'Error al reenviar email';
    } finally {
      this.loading.set(false);
    }
  }
}
