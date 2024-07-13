import { PrismaClient } from "@prisma/client";
import { Console } from "console";

class PaymentModel {
  private database: PrismaClient;

  constructor(databaseInstance: PrismaClient) {
    this.database = databaseInstance;
  }

  async createPayment(
    clientId: string,
    saleId: string,
    paymentDate: Date,
    amount: number
  ) {
    try {

      const sale = await this.database.sale.findUnique({
        where: {
          id: saleId,
          clientId: clientId,
        },
        include: {
          clients: true,
          details: true,
        },
      });

      if (!sale) {
        console.log("sale not found");
        return false;
      }

      const pay = await this.database.payment.create({
        data: {
          amount: amount,
          sales: {
            connect: {
              id: saleId,
            },
          },
        },
      });


      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

export default PaymentModel;
