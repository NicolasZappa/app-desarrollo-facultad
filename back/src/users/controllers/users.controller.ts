import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { UserEntity } from "../entities/user.entity";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../enums/user-role.enum";
import { UpdateRoleDto } from "../dto/update-role.dto";
import { ChangePasswordDto } from "../dto/change-password.dto";
import { UpdateEmailDto } from "../dto/update-email.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param("id") id: string): Promise<UserEntity | null> {
    return this.usersService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<UserEntity> {
    return this.usersService.create(email, password);
  }

  @Patch("me/password")
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() req: { user: { id: string } },
    @Body() dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.usersService.changePassword(
      req.user.id,
      dto.currentPassword,
      dto.newPassword,
    );
    return { message: "Password updated" };
  }

  @Patch("me/email")
  @UseGuards(JwtAuthGuard)
  async updateEmail(
    @Req() req: { user: { id: string } },
    @Body() dto: UpdateEmailDto,
  ): Promise<{ message: string }> {
    await this.usersService.updateEmail(req.user.id, dto.newEmail, dto.password);
    return { message: "Email updated" };
  }

  @Delete("me")
  @UseGuards(JwtAuthGuard)
  async deleteAccount(
    @Req() req: { user: { id: string } },
    @Body() { password }: { password: string },
  ): Promise<{ message: string }> {
    await this.usersService.deleteAccount(req.user.id, password);
    return { message: "Account deleted" };
  }

  @Patch(":id/role")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateRole(
    @Req() req: { user: { id: string } },
    @Param("id") id: string,
    @Body() body: UpdateRoleDto,
  ): Promise<UserEntity | null> {
    return this.usersService.updateRole(req.user.id, id, body.role);
  }
}
