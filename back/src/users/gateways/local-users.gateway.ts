import { UsersGateway } from "./users.gateway";
import { ExternalUser } from "../user.types";
import * as fs from "fs";
import * as path from "path";

export class LocalUsersGateway implements UsersGateway {
  private readonly users: ExternalUser[];

  constructor() {
    const filePath = path.join(process.cwd(), "src/users/data/users.json");
    this.users = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  async fetchAll(): Promise<ExternalUser[]> {
    return this.users;
  }
  async fetchById(id: number): Promise<ExternalUser> {
    const user = this.users.find((user: ExternalUser) => user.id === id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
