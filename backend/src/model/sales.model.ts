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

      await this.database.saleDetail.createMany({
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

      return this.findUniqueSales(sale.id);
    } catch (error: unknown) {
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

  async deleteSales(id: string): Promise<any> {
    const sale = await this.findUniqueSales(id);

    if (!sale) {
      return null;
    }

    await this.database.saleDetail.deleteMany({
      where: {
        saleId: id,
      },
    });

    await this.database.sale.delete({
      where: {
        id: id,
      },
    });

    return sale;
  }

  async deleteSalesDetails(id: string): Promise<any> {
    const saleDetail = await this.database.saleDetail.findUnique({
      where: {
        id: id,
      },
    });

    if (!saleDetail) {
      return null;
    }

    await this.database.saleDetail.delete({
      where: {
        id: id,
      },
    });

    return saleDetail;
  }

  async updateSalesDetails(id: string, data: any): Promise<any> {
    const saleDetail = await this.database.saleDetail.findUnique({
      where: {
        id: id,
      },
    });

    if (!saleDetail) {
      return null;
    }

    await this.database.saleDetail.update({
      where: {
        id: id,
      },
      data: {
        quantity: data.quantity,
        product: data.product,
        price: data.price,
        tax: data.tax,
        discount: data.discount,
      },
    });
  }

  async createSalesDetails(saleId: any, details: any): Promise<any> {
    try {
      await this.database.saleDetail.createMany({
        data: details.map((detail: any) => {
          return {
            quantity: detail.quantity,
            product: detail.product,
            price: detail.price,
            tax: detail.tax,
            discount: detail.discount,
            saleId: saleId,
          };
        }),
      });

      return this.findUniqueSales(saleId);
    } catch (error: unknown) {
      console.log("error createSalesDetails");
      console.error(error);
      return null;
    }
  }

  async findUniqueSalesDetails(id: string): Promise<any> {
    const saleDetail = await this.database.saleDetail.findUnique({
      where: {
        id: id,
      },
    });

    return saleDetail;
  }
}

export default SalesModel;
