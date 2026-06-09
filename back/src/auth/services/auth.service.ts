import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UserEntity } from "../../users/entities/user.entity";
import { UsersService } from "../../users/services/users.service";
import { ConfigService } from "@nestjs/config";

export interface AuthPayload {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async register(email: string, password: string): Promise<AuthPayload> {
    try {
      const user = await this.usersService.create(email, password);
      return this.generateAuthPayload(user);
    } catch (error) {
      throw new BadRequestException("Error registrando usuario");
    }
  }

  async login(email: string, password: string): Promise<AuthPayload> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    return this.generateAuthPayload(user);
  }

  private generateAuthPayload(user: UserEntity): AuthPayload {
    const accessToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: this.configService.get("JWT_EXPIRES_IN") },
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
