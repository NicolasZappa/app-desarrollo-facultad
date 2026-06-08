export const USERS_REPOSITORY = "USERS_REPOSITORY";
import { UserEntity } from "../entities/user.entity";
import { UserRole } from "../enums/user-role.enum";

export interface UsersRepository {
  findAll(): Promise<UserEntity[]>;
  findOne(id: string): Promise<UserEntity | null>;
  create(email: string, password: string): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
}
