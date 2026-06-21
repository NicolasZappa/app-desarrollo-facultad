import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordPage implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toast = inject(ToastService);

  token = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.toast.error('Token de recuperación no encontrado');
    }
  }

  async submit(): Promise<void> {
    if (!this.token) {
      this.toast.error('Token de recuperación no válido');
      return;
    }

    this.loading.set(true);

    if (this.password !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      this.loading.set(false);
      return;
    }

    try {
      await firstValueFrom(this.auth.resetPassword({ token: this.token, password: this.password }));
      this.toast.success('Contraseña actualizada');
      this.password = '';
      this.confirmPassword = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al restablecer la contraseña');
    } finally {
      this.loading.set(false);
    }
  }
}
