import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { UserEntity } from "../../users/entities/user.entity";
import { UsersService } from "../../users/services/users.service";
import { ConfigService } from "@nestjs/config";
import { EmailService } from "../../email/services/email.service";

export interface AuthPayload {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  isVerified: boolean;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(email: string, password: string): Promise<AuthPayload> {
    try {
      const verificationToken = crypto.randomUUID();
      const user = await this.usersService.create(email, password, verificationToken);
      await this.emailService.sendVerificationEmail(user.email, verificationToken);
      return this.generateAuthPayload(user);
    } catch (error) {
      console.error("Register error:", error);
      throw new BadRequestException("Error registrando usuario");
    }
  }

  async login(email: string, password: string): Promise<AuthPayload> {
    try {
      const user = await this.usersService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException("Credenciales inválidas");
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      if (!isPasswordValid) {
        throw new UnauthorizedException("Credenciales inválidas");
      }

      return this.generateAuthPayload(user);
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException("Error al iniciar sesión");
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await this.usersService.findByVerificationToken(token);

    if (!user) {
      throw new BadRequestException("Token inválido o expirado");
    }

    await this.usersService.markVerified(user.id);
    return { message: "Email verificado" };
  }

  async resendVerification(userId: string): Promise<{ message: string }> {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new BadRequestException("Usuario no encontrado");
    }

    if (user.isVerified) {
      throw new BadRequestException("El email ya está verificado");
    }

    const verificationToken = crypto.randomUUID();
    await this.usersService.updateVerificationToken(user.id, verificationToken);
    await this.emailService.sendVerificationEmail(user.email, verificationToken);

    return { message: "Email de verificación reenviado" };
  }

  async getMe(userId: string): Promise<UserProfile> {
    const user = await this.usersService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return { message: "Si el email existe, recibirás un link" };
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await this.usersService.updateResetPasswordToken(user.id, token, expiresAt);
    await this.emailService.sendResetPasswordEmail(user.email, token);

    return { message: "Si el email existe, recibirás un link" };
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const user = await this.usersService.findByResetPasswordToken(token);

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException("Token inválido o expirado");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await this.usersService.resetPassword(user.id, passwordHash);
    await this.usersService.updateResetPasswordToken(user.id, null, null);

    return { message: "Contraseña actualizada" };
  }

  private generateAuthPayload(user: UserEntity): AuthPayload {
    const accessToken = this.jwtService.sign(
      { sub: user.id },
    );

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}
