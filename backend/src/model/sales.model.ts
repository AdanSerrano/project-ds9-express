import { PrismaClient } from "@prisma/client";

class SalesModel {
  private database: PrismaClient;

  constructor(databaseInstance: PrismaClient) {
    this.database = databaseInstance;
  }

  async createSales(inputData: any): Promise<any> {
    const { clientId, saleDate } = inputData;
    return await this.database.sale.create({
      data: {
        clientId,
        saleDate,
      },
    });
  }

  async findUniqueSales(id: string) {
    return await this.database.sale.findUnique({
      where: {
        id: id,
      },
    });
  }

  async findAllSales(): Promise<any> {
    return await this.database.sale.findMany();
  }

  // async updateUser(email: string, inputData: any): Promise<any> {
  //   return await this.database.user.update({
  //     where: {
  //       email: email,
  //     },
  //     data: {
  //       name: inputData.name,
  //       role: inputData.role,
  //     },
  //   });
  // }

  async deleteSales(id: string): Promise<any> {
    return await this.database.sale.delete({
      where: {
        id: id,
      },
    });
  }
}

export default SalesModel;
