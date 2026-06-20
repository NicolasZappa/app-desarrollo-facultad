import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>("SMTP_HOST", "localhost"),
      port: this.configService.get<number>("SMTP_PORT", 587),
      secure: this.configService.get<boolean>("SMTP_SECURE", false),
      auth: {
        user: this.configService.get<string>("SMTP_USER", ""),
        pass: this.configService.get<string>("SMTP_PASS", ""),
      },
    });
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const link = `http://localhost:4200/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get<string>("SMTP_FROM", "noreply@example.com"),
      to: email,
      subject: "Verifica tu email",
      html: `<p>Hacé clic en el siguiente enlace para verificar tu email:</p><p><a href="${link}">${link}</a></p>`,
    });
  }

  async sendResetPasswordEmail(email: string, token: string): Promise<void> {
    const link = `http://localhost:4200/reset-password?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get<string>("SMTP_FROM", "noreply@example.com"),
      to: email,
      subject: "Recuperá tu contraseña",
      html: `<p>Hacé clic en el siguiente enlace para cambiar tu contraseña:</p><p><a href="${link}">${link}</a></p>`,
    });
  }
}
