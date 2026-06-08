import { BadGatewayException, Inject, Injectable } from "@nestjs/common";
import {
  UsersRepository,
  USERS_REPOSITORY,
} from "../repositories/users.repository";

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

  async create(email: string, password: string) {
    try {
      return await this.usersRepository.create(email, password);
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
}
