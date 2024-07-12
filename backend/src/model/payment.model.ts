import { PrismaClient } from "@prisma/client";

class PaymentModel {
  private database: PrismaClient;

    constructor(databaseInstance: PrismaClient) {
        this.database = databaseInstance;
    }

}

export default PaymentModel;