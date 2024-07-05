import { PrismaClient } from "@prisma/client";

class SalesModel {
  private database: PrismaClient;

  constructor(databaseInstance: PrismaClient) {
    this.database = databaseInstance;
  }

  async createSales(clientId: any, saleDate: any, details: any): Promise<any> {
    try {
      
    const sale = await this.database.sale.create({
      data: {
        saleDate: new Date(saleDate),
        clients: {
          connect: {
            id: clientId,
          },
        },
      },
    });

    const detailsSale = await this.database.saleDetail.createMany({
      data: details.map((detail: any) => {
        return {
          quantity: detail.quantity,
          product: detail.product,
          price: detail.price,
          tax: detail.tax,
          discount: detail.discount,
          saleId: sale.id,
        };
      }),
    });

    return {sale, detailsSale};

    }
    catch (error: unknown) {
      console.log("error createSales");
      console.error(error);
      return null;
    }
  }

  async findUniqueSales(id: string) {

    const sale = await this.database.sale.findUnique({
      where: {
        id: id,
      },
      include: {
        clients: true,
        details: true,
      },
    });

    return sale;
  }

  async findAllSales(): Promise<any> {
    var sales = await this.database.sale.findMany({
      include: {
        clients: true,
        details: true,
      },
    });
    return sales;
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
