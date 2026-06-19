import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

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

  @Post("verify-email")
  async verifyEmail(@Body() { token }: { token: string }) {
    return this.authService.verifyEmail(token);
  }

  @Post("resend-verification")
  @UseGuards(JwtAuthGuard)
  async resendVerification(@Req() req: { user: { id: string } }) {
    return this.authService.resendVerification(req.user.id);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: { user: { id: string } }) {
    return this.authService.getMe(req.user.id);
  }
}
