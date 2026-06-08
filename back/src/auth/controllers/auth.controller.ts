import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "../services/auth.service";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  async login(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return this.authService.login(email, password);
  }

  @Post("register")
  async register(
    @Body() { email, password }: { email: string; password: string },
  ) {
    return this.authService.register(email, password);
  }
}
