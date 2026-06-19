import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  loading = signal(true);
  verified = false;
  error = '';

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.error = 'Token no encontrado';
      this.loading.set(false);
      return;
    }

    try {
      const res = await firstValueFrom(this.auth.verifyEmail(token));
      this.verified = true;
      this.loading.set(false);
    } catch (err: any) {
      this.error = err.error?.message || 'Token inválido o expirado';
      this.loading.set(false);
    }
  }
}
