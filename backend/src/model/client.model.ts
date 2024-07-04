import { PrismaClient } from "@prisma/client";

class ClientModel {
  private database: PrismaClient;

  constructor(databaseInstance: PrismaClient) {
    this.database = databaseInstance;
  }

  async findMany() {
    return await this.database.client.findMany();
  }

  async findUnique(userid: string) {
    return await this.database.client.findUnique({
      where: {
        id: userid,
      },
    });
  }

  async createClient(inputData: any) {
    const { name, lastname, phoneNumber, ident } = inputData;
    return await this.database.client.create({
      data: {
        name,
        lastname,
        phoneNumber,
        ident,
      },
    });
  }

  async updateClient(userid: string, inputData: any) {
    return await this.database.client.update({
      where: {
        id: userid,
      },
      data: {
        name: inputData.name,
        lastname: inputData.lastname,
        phoneNumber: inputData.phoneNumber,
      },
    });
  }

  async deleteClient(userid: string) {
    return await this.database.client.delete({
      where: {
        id: userid,
      },
    });
  }
}

export default ClientModel;
