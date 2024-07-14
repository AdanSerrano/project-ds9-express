import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
class SalesModel {
  private database: PrismaClient;

  constructor(databaseInstance: PrismaClient) {
    this.database = databaseInstance;
  }


  async updateTotalSales(saleId: string): Promise<void> {
    try {
      const saleDetails = await this.database.saleDetail.findMany({
        where: { saleId }
      });

      const totalSale = saleDetails.reduce((acc, detail) => {
        const netPrice = detail.price - detail.discount;
        const taxAmount = netPrice * detail.tax;
        return acc + (detail.quantity * (netPrice + taxAmount));
      }, 0);

      await this.database.sale.update({
        where: { id: saleId },
        data: { TotalSale: totalSale }
      });

    } catch (error) {
      console.error('Error updating total sales:', error);
      throw new Error('Failed to update total sales');
    }
  }


  async createSales(clientId: any, saleDate: any, details: any): Promise<any> {
    try {
      const maxInvoiceId = await this.database.sale.findFirst({
        select: {
          invoiceId: true,
        },
        orderBy: {
          id: "desc",
        },
      });

      const client = await this.database.client.findUnique({
        where: {
          id: clientId,
        },
      });

      const sale = await this.database.sale.create({
        data: {
          saleDate: new Date(saleDate),
          clientId: clientId,
          invoiceId: maxInvoiceId ? Number(maxInvoiceId.invoiceId) + 1 : 1,
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

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: client?.email || '',
        subject: 'Hello SALfjalsfjlasfj la',
        html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
      });

      //return this.updateTotalSales(sale.id);

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

  async updateSales(id: string, clientId: any, saleDate: any, details: any): Promise<any> {
    try {
      const sale = await this.database.sale.update({
        where: { id },
        data: {
          saleDate: new Date(saleDate),
          clients: {
            connect: {
              id: clientId,
            },
          },
        },
      });

      await this.database.saleDetail.deleteMany({
        where: { saleId: id },
      });

      await this.database.saleDetail.createMany({
        data: details.map((detail: any) => ({
          quantity: detail.quantity,
          product: detail.product,
          price: detail.price,
          tax: detail.tax,
          discount: detail.discount,
          saleId: sale.id,
        })),
      });

      return await this.findUniqueSales(sale.id);
    } catch (error: unknown) {
      console.error("Error updating sales:", error);
      throw error;
    }
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
