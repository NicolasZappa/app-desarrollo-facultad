import {
  Body,
  Controller,
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

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(":id")
  @Roles(UserRole.ADMIN)
  async findOne(@Param("id") id: string): Promise<UserEntity | null> {
    return this.usersService.findOne(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<UserEntity> {
    return this.usersService.create(email, password);
  }

  @Patch("me/password")
  async changePassword(
    @Req() req: { user: { id: string } },
    @Body("currentPassword") currentPassword: string,
    @Body("newPassword") newPassword: string,
  ): Promise<UserEntity | null> {
    return this.usersService.changePassword(
      req.user.id,
      currentPassword,
      newPassword,
    );
  }

  @Patch("me/email")
  async updateEmail(
    @Req() req: { user: { id: string } },
    @Body("newEmail") newEmail: string,
  ): Promise<UserEntity | null> {
    return this.usersService.updateEmail(req.user.id, newEmail);
  }

  @Patch(":id/role")
  @Roles(UserRole.ADMIN)
  async updateRole(
    @Param("id") id: string,
    @Body("role") role: UserRole,
  ): Promise<UserEntity | null> {
    return this.usersService.updateRole(id, role);
  }
}
