require("dotenv").config();
const paypal = require("../model/services/paypal.services");
import axios from "axios";
import { log } from "console";

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
      const saleInfo = await axios.get(
        `${process.env.PAYPAL_URL_API_LOCAL}/sales/${saleId}`
      );

      let total = 0;
      saleInfo.data.details.forEach((detail: any) => {
        total += detail.total;
      });

      const order = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: parseFloat(total.toFixed(2)),
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

      console.log({ access_token });

      // make a request
      const response = await axios.post(
        `${process.env.PAYPAL_URL}/v2/checkout/orders`,
        order,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    return this.paymentService.createPayment(
      clientId,
      saleId,
      paymentDate,
      amount
    );
  }

  async capturePayment(token: any | undefined) {
    try {
        console.log(token);
        console.log(`${String(process.env.PAYPAL_URL).replace('api-m.', 'api.')}/v2/checkout/orders/${token}/capture`);
      const response = await axios.post(
        `${String(process.env.PAYPAL_URL).replace('api-m.', 'api.')}/v2/checkout/orders/${token}/capture`,
        {},
        {
          auth: {
            username: process.env.PAYPAL_CLIENT_ID || "",
            password: process.env.PAYPAL_CLIENT_SECRET || "",
          },
        }
      );

      console.log(response.data);

      //res.redirect("/payed.html");
    } catch (error: unknown) {
      console.log("error en capturePayment");
      console.log(error);
      //return res.status(500).json({ message: "Internal Server error" });
    }

    return "";
  }

  async findAllPayments() {
    return this.paymentService.findAllPayments();
  }

  async getOnePayment(id: string) {
    return this.paymentService.getOnePayment(id);
  }
}

export default PaymentController;
