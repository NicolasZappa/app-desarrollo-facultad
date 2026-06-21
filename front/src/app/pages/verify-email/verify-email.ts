import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private toast = inject(ToastService);

  loading = signal(true);
  verified = false;

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParams['token'];

    if (!token) {
      this.toast.error('Token no encontrado');
      this.loading.set(false);
      return;
    }

    try {
      await firstValueFrom(this.auth.verifyEmail(token));
      this.verified = true;
      this.loading.set(false);
      this.toast.success('Email verificado correctamente');
    } catch (err: any) {
      this.loading.set(false);
      this.toast.error(err.error?.message || 'Token inválido o expirado');
    }
  }
}
