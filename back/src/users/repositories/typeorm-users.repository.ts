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

  async create(email: string, password: string): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(password, 10);
    const count = await this.userRepository.count();
    const user = this.userRepository.create({
      email,
      passwordHash,
      role: count === 0 ? UserRole.ADMIN : UserRole.USER,
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
}
