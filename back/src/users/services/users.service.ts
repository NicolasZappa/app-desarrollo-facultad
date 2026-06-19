import {
  BadGatewayException,
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import {
  UsersRepository,
  USERS_REPOSITORY,
} from "../repositories/users.repository";
import { UserRole } from "../enums/user-role.enum";

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  async findAll() {
    try {
      return await this.usersRepository.findAll();
    } catch (error) {
      throw new BadGatewayException("Error fetching users");
    }
  }

  async findOne(id: string) {
    try {
      return await this.usersRepository.findOne(id);
    } catch (error) {
      throw new BadGatewayException("Error fetching user");
    }
  }

  async create(email: string, password: string, verificationToken?: string) {
    try {
      return await this.usersRepository.create(email, password, verificationToken);
    } catch (error) {
      throw new BadGatewayException("Error creating user");
    }
  }

  async findByEmail(email: string) {
    try {
      return await this.usersRepository.findByEmail(email);
    } catch (error) {
      throw new BadGatewayException("Error fetching user by email");
    }
  }

  async findByVerificationToken(token: string) {
    try {
      return await this.usersRepository.findByVerificationToken(token);
    } catch (error) {
      throw new BadGatewayException("Error fetching user by verification token");
    }
  }

  async markVerified(id: string) {
    try {
      return await this.usersRepository.markVerified(id);
    } catch (error) {
      throw new BadGatewayException("Error marking user as verified");
    }
  }

  async updateVerificationToken(id: string, token: string | null) {
    try {
      return await this.usersRepository.updateVerificationToken(id, token);
    } catch (error) {
      throw new BadGatewayException("Error updating verification token");
    }
  }

  async updateRole(requesterId: string, id: string, role: UserRole) {
    try {
      if (requesterId === id) {
        throw new ForbiddenException("Cannot change your own role");
      }

      const user = await this.usersRepository.findOne(id);
      if (!user) {
        throw new BadRequestException("User not found");
      }

      if (role === UserRole.USER && user.role === UserRole.ADMIN) {
        const allUsers = await this.usersRepository.findAll();
        const adminCount = allUsers.filter(u => u.role === UserRole.ADMIN).length;
        if (adminCount <= 1) {
          throw new ForbiddenException("Cannot demote the only admin");
        }
      }

      return await this.usersRepository.updateRole(id, role);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new BadGatewayException("Error updating user role");
    }
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ) {
    try {
      const user = await this.usersRepository.findOneWithPassword(id);
      if (!user) {
        throw new BadRequestException("User not found");
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException("Current password is incorrect");
      }

      const passwordHash = await bcrypt.hash(newPassword, 10);
      return await this.usersRepository.updatePassword(id, passwordHash);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadGatewayException("Error changing password");
    }
  }

  async updateEmail(id: string, newEmail: string, password: string) {
    try {
      const user = await this.usersRepository.findOneWithPassword(id);
      if (!user) {
        throw new BadRequestException("User not found");
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException("Password is incorrect");
      }

      return await this.usersRepository.updateEmail(id, newEmail);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      throw new BadGatewayException("Error updating email");
    }
  }
}
