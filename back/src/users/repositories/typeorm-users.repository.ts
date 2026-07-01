import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { UsersRepository } from "./users.repository";
import { UserRole } from "../enums/user-role.enum";
import * as bcrypt from "bcrypt";

@Injectable()
export class TypeOrmUsersRepository implements UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}
  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(email: string, password: string, verificationToken?: string): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(password, 10);
    const count = await this.userRepository.count();
    const user = this.userRepository.create({
      email,
      passwordHash,
      role: count === 0 ? UserRole.ADMIN : UserRole.USER,
      verificationToken: verificationToken ?? null,
    });
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.email = :email", { email })
      .getOne();
  }

  async findOneWithPassword(id: string): Promise<UserEntity | null> {
    return this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.passwordHash")
      .where("user.id = :id", { id })
      .getOne();
  }

  async updateRole(id: string, role: UserRole): Promise<UserEntity | null> {
    await this.userRepository.update(id, { role });
    return this.userRepository.findOne({ where: { id } });
  }

  async updatePassword(
    id: string,
    passwordHash: string,
  ): Promise<UserEntity | null> {
    await this.userRepository.update(id, { passwordHash });
    return this.userRepository.findOne({ where: { id } });
  }

  async findByVerificationToken(token: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { verificationToken: token } });
  }

  async findByResetPasswordToken(token: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({ where: { resetPasswordToken: token } });
  }

  async markVerified(id: string): Promise<UserEntity | null> {
    await this.userRepository.update(id, { isVerified: true, verificationToken: null });
    return this.userRepository.findOne({ where: { id } });
  }

  async updateVerificationToken(id: string, token: string | null): Promise<UserEntity | null> {
    await this.userRepository.update(id, { verificationToken: token });
    return this.userRepository.findOne({ where: { id } });
  }

  async updateResetPasswordToken(
    id: string,
    token: string | null,
    expires: Date | null,
  ): Promise<UserEntity | null> {
    await this.userRepository.update(id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires,
    });
    return this.userRepository.findOne({ where: { id } });
  }

  async updateEmail(id: string, email: string): Promise<UserEntity | null> {
    await this.userRepository.update(id, { email });
    return this.userRepository.findOne({ where: { id } });
  }

  async remove(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    await this.userRepository.remove(user);
    return user;
  }
}
