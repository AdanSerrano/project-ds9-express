import { PrismaClient } from "@prisma/client";
import * as bcryptjs from "bcryptjs";

class UserModel {
  private database: PrismaClient;

  constructor(databaseInstance: PrismaClient) {
    this.database = databaseInstance;
  }

  async createUser(inputData: any): Promise<any> {
    const { name, email, password, role } = inputData;
    return await this.database.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });
  }

  async findUnique(id: string) {
    return await this.database.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findUserByEmail(email: string) {
    return await this.database.user.findFirst({
      where: {
        email: email,
      },
    });
  }

  async findAllUsers(): Promise<any> {
    return await this.database.user.findMany();
  }

  async updateUser(id: string, inputData: any): Promise<any> {
    return await this.database.user.update({
      where: {
        id: id,
      },
      data: {
        name: inputData.name,
        role: inputData.role,
        email: inputData.email
      },
    });
  }

  async changePassword(
    email: string,
    passwordOld: string,
    newPassword: string
  ): Promise<any> {
    const user = await this.database.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = bcryptjs.compareSync(passwordOld, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const salt = bcryptjs.genSaltSync(10);
    const passwordHash = bcryptjs.hashSync(newPassword, salt);

    return await this.database.user.update({
      where: {
        email: email,
      },
      data: {
        password: passwordHash,
      },
    });
  }

  async deleteUser(id: string): Promise<any> {
    return await this.database.user.delete({
      where: {
        id: id,
      },
    });
  }
}

export default UserModel;
