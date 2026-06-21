import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  private usersService = inject(UsersService);
  private toast = inject(ToastService);

  user = this.auth.user;

  resending = signal(false);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordLoading = signal(false);

  newEmail = '';
  emailPassword = '';
  emailLoading = signal(false);

  async resend(): Promise<void> {
    this.resending.set(true);

    if (!this.auth.isAuthenticated()) {
      return;
    }

    try {
      await firstValueFrom(this.auth.resendVerification());
      this.toast.success('Email reenviado');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al reenviar email');
    } finally {
      this.resending.set(false);
    }
  }

  async changePassword(): Promise<void> {
    if (this.newPassword !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }

    this.passwordLoading.set(true);

    try {
      await firstValueFrom(this.usersService.changePassword({
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
      }));
      this.toast.success('Contraseña actualizada');
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al cambiar la contraseña');
    } finally {
      this.passwordLoading.set(false);
    }
  }

  async changeEmail(): Promise<void> {
    this.emailLoading.set(true);

    try {
      await firstValueFrom(this.usersService.updateEmail({
        newEmail: this.newEmail,
        password: this.emailPassword,
      }));
      this.toast.success('Email actualizado');
      this.newEmail = '';
      this.emailPassword = '';
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al cambiar el email');
    } finally {
      this.emailLoading.set(false);
    }
  }
}
