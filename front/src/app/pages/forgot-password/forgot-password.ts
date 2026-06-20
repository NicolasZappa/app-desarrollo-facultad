import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPasswordPage {
  private auth = inject(AuthService);

  email = '';
  error = '';
  message = '';
  loading = signal(false);

  async submit(): Promise<void> {
    this.error = '';
    this.message = '';
    this.loading.set(true);

    try {
      const res = await firstValueFrom(this.auth.forgotPassword({ email: this.email }));
      this.message = res.message;
    } catch (err: any) {
      this.error = err.error?.message || 'Error al enviar el email de recuperación';
    } finally {
      this.loading.set(false);
    }
  }
}
