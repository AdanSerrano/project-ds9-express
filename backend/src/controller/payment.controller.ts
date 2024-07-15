import axios from "axios";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class PaymentController {
  private paymentService: any;
  private verificationService: any;

  constructor(paymentService: any, verificationService: any) {
    this.paymentService = paymentService;
    this.verificationService = verificationService;
  }

  async createToken() {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    const {
      data: { access_token },
    } = await axios.post(`${process.env.PAYPAL_URL}/v1/oauth2/token`, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: process.env.PAYPAL_CLIENT_ID || "",
        password: process.env.PAYPAL_CLIENT_SECRET || "",
      },
    });

    return access_token;
  }

  async createPayment(
    clientId: string,
    saleId: string,
    paymentDate: Date,
    amount: number
  ) {
    try {
      // const saleInfo = await axios.get(
      //   `${process.env.PAYPAL_URL_API_LOCAL}/sales/${saleId}`
      // );

      // let total = 0;
      // saleInfo.data.details.forEach((detail: any) => {
      //   total += detail.total;
      // });
      const sale = await prisma.sale.findUnique({
        where: { id: saleId },
        include: { details: true }
      });

      if (!sale) {
        throw new Error("Sale not found");
      }

      const order = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: sale.TotalSale.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: `${process.env.PAYPAL_COMPANY}`,
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: `${process.env.PAYPAL_URL_API_LOCAL}/payments/captureOrder`,
          cancel_url: `${process.env.PAYPAL_URL_API_LOCAL}/payments/cancelPayment`,
        },
      };

      const access_token = await this.createToken();

      const response = await axios.post(
        `${process.env.PAYPAL_URL}/v2/checkout/orders`,
        order,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      // Create a new payment record in the database
      const payment = await prisma.payment.create({
        data: {
          saleId: saleId,
          amount: sale.TotalSale,
          status: "pending",
        }
      });

      return response.data;
    } catch (error) {
      console.error("Error creating payment:", error);
      throw error;
    }
  }

  async capturePayment(token: string) {
    try {
      const response = await axios.post(
        `${process.env.PAYPAL_URL}/v2/checkout/orders/${token}/capture`,
        {},
        {
          auth: {
            username: process.env.PAYPAL_CLIENT_ID || "",
            password: process.env.PAYPAL_CLIENT_SECRET || "",
          },
        }
      );

      // Update the payment status in the database
      const paymentDetails = response.data.purchase_units[0].payments.captures[0];
      const updatedPayment = await prisma.payment.update({
        where: { id: paymentDetails.id },
        data: {
          status: "completed",
          amount: parseFloat(paymentDetails.amount.value),
        }
      });

      // Update the sale to mark it as paid
      await prisma.sale.update({
        where: { id: updatedPayment.saleId },
        data: { isPayment: true, Payment: updatedPayment.amount }
      });

      return response.data;
    } catch (error) {
      console.error("Error capturing payment:", error);
      throw error;
    }
  }

  async cancelPayment(token: string) {
    try {
      // You might want to implement cancellation logic here
      // For now, we'll just update the payment status to "cancelled"
      const payment = await prisma.payment.findFirst({
        where: { status: "pending" },
        orderBy: { createdAt: 'desc' }
      });

      if (payment) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: { status: "cancelled" }
        });
      }

      return { message: "Payment cancelled", token };
    } catch (error) {
      console.error("Error cancelling payment:", error);
      throw error;
    }
  }

  async findAllPayments() {
    return prisma.payment.findMany();
  }

  async getOnePayment(id: string) {
    return prisma.payment.findUnique({
      where: { id }
    });
  }
}

export default PaymentController;