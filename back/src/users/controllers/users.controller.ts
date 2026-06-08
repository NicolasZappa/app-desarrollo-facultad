import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { UserEntity } from "../entities/user.entity";
import { JwtAuthGuard } from "../../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../../auth/guards/roles.guard";
import { Roles } from "../../auth/decorators/roles.decorator";
import { UserRole } from "../enums/user-role.enum";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: string): Promise<UserEntity | null> {
    return this.usersService.findOne(id);
  }

  @Post()
  async create(
    @Body() { email, password }: { email: string; password: string },
  ): Promise<UserEntity> {
    return this.usersService.create(email, password);
  }
}
