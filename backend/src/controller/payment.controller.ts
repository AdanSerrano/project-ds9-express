import axios from "axios";
import { PrismaClient } from '@prisma/client';
import { Resend } from "resend";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

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

      const paymentDetails = response.data.purchase_units[0].payments.captures[0];

      const pendingPayment = await prisma.payment.findFirst({
        where: { status: "pending" },
        orderBy: { createdAt: 'desc' },
      });

      if (!pendingPayment) {
        throw new Error("No pending payment found");
      }

      const updatedPayment = await prisma.payment.update({
        where: { id: pendingPayment.id },
        data: {
          status: "completed",
          amount: parseFloat(paymentDetails.amount.value),
        }
      });

      await prisma.sale.update({
        where: { id: updatedPayment.saleId },
        data: { isPayment: true, Payment: updatedPayment.amount }
      });


      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: process.env.RESEND_ADMIN as string,
        subject: "Pagar Factura",
        html: `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <style>
      .invoice-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
        margin-bottom: 20px;
      }
      .invoice-table th, .invoice-table td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: left;
      }
      .invoice-table th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      .invoice-table tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      .total-row {
        font-weight: bold;
        background-color: #e6e6e6 !important;
      }
      .success-message {
        background-color: #d4edda;
        color: #155724;
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
        text-align: center;
        font-weight: bold;
      }
    </style>
  </head>
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Pago Realizado<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body style="background-color:rgb(255,255,255);margin-top:auto;margin-bottom:auto;margin-left:auto;margin-right:auto;font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;;padding-left:0.5rem;padding-right:0.5rem">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:465px;border-width:1px;border-style:solid;border-color:rgb(234,234,234);border-radius:0.25rem;margin-top:40px;margin-bottom:40px;margin-left:auto;margin-right:auto;padding:20px">
      <tbody>
        <tr style="width:100%">
          <td>
            <h1 style="color:rgb(0,0,0);font-size:24px;font-weight:400;text-align:center;padding:0px;margin-top:30px;margin-bottom:30px;margin-left:0px;margin-right:0px">Pago <strong>Realizado</strong></h1>

            <div class="success-message">
              ¡Pago procesado con éxito!
            </div>

            <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Estimado cliente,</p>
            <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Le confirmamos que hemos recibido su pago correctamente. A continuación, se detallan los datos de la transacción:</p>


            <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-width:1px;border-style:solid;border-color:rgb(234,234,234);margin-top:26px;margin-bottom:26px;margin-left:0px;margin-right:0px" />
            <p style="font-size:12px;line-height:24px;margin:16px 0;color:rgb(102,102,102)">Gracias por su pago. Si tiene alguna pregunta sobre esta transacción, por favor responda a este correo electrónico. Apreciamos su negocio.</p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>
        `
      })
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