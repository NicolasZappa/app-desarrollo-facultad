import { Global, Module } from "@nestjs/common";
import { UsersController } from "./controllers/users.controller";
import { JsonPlaceholderUsersGateway } from "./gateways/jsonplaceholder-users.gateway";
import { LocalUsersGateway } from "./gateways/local-users.gateway";
import { USERS_GATEWAY } from "./gateways/users.gateway";
import { UsersService } from "./services/users.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { USERS_REPOSITORY } from "./repositories/users.repository";
import { TypeOrmUsersRepository } from "./repositories/typeorm-users.repository";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USERS_REPOSITORY,
      useClass: TypeOrmUsersRepository,
    },
  ],
  exports: [UsersService, USERS_REPOSITORY],
})
export class UsersModule {}
