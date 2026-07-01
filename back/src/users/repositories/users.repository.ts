export const USERS_REPOSITORY = "USERS_REPOSITORY";
import { UserEntity } from "../entities/user.entity";
import { UserRole } from "../enums/user-role.enum";

export interface UsersRepository {
  findAll(): Promise<UserEntity[]>;
  findOne(id: string): Promise<UserEntity | null>;
  findOneWithPassword(id: string): Promise<UserEntity | null>;
  create(email: string, password: string, verificationToken?: string): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByVerificationToken(token: string): Promise<UserEntity | null>;
  findByResetPasswordToken(token: string): Promise<UserEntity | null>;
  markVerified(id: string): Promise<UserEntity | null>;
  updateVerificationToken(id: string, token: string | null): Promise<UserEntity | null>;
  updateResetPasswordToken(
    id: string,
    token: string | null,
    expires: Date | null,
  ): Promise<UserEntity | null>;
  updateRole(id: string, role: UserRole): Promise<UserEntity | null>;
  updatePassword(id: string, passwordHash: string): Promise<UserEntity | null>;
  updateEmail(id: string, email: string): Promise<UserEntity | null>;
  remove(id: string): Promise<UserEntity | null>;
}
