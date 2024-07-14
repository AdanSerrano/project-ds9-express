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
        where: { saleId },
      });

      const totalSale = saleDetails.reduce((acc, detail) => {
        const netPrice = detail.price - detail.discount;
        const taxAmount = netPrice * detail.tax;
        return acc + detail.quantity * (netPrice + taxAmount);
      }, 0);

      await this.database.sale.update({
        where: { id: saleId },
        data: { TotalSale: totalSale },
      });
    } catch (error) {
      console.error("Error updating total sales:", error);
      throw new Error("Failed to update total sales");
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
        from: "onboarding@resend.dev",
        to: process.env.RESEND_ADMIN as string,
        subject: "Hello SALfjalsfjlasfj la",
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">

  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">You updated the password for your Twitch account<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body style="background-color:#efeef1;font-family:HelveticaNeue,Helvetica,Arial,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:580px;margin:30px auto;background-color:#ffffff">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="display:flex;justify-content:center;aling-items:center;padding:30px">
              <tbody>
                <tr>
                  <td><img src="https://react-email-demo-dr9excyry-resend.vercel.app/static/twitch-logo.png" style="display:block;outline:none;border:none;text-decoration:none" width="114" /></td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="width:100%;display:flex">
              <tbody>
                <tr>
                  <td>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td data-id="__react-email-column" style="border-bottom:1px solid rgb(238,238,238);width:249px"></td>
                          <td data-id="__react-email-column" style="border-bottom:1px solid rgb(145,71,255);width:102px"></td>
                          <td data-id="__react-email-column" style="border-bottom:1px solid rgb(238,238,238);width:249px"></td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:5px 20px 10px 20px">
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">Hi <!-- -->alanturing<!-- -->,</p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">You updated the password for your Twitch account on<!-- --> <!-- -->Jun 23, 2022, 4:06:00 PM<!-- -->. If this was you, then no further action is required.</p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">However if you did NOT perform this password change, please<!-- --> <a href="#" style="color:#067df7;text-decoration:underline" target="_blank">reset your account password</a> <!-- -->immediately.</p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">Remember to use a password that is both strong and unique to your Twitch account. To learn more about how to create a strong and unique password,<!-- --> <a href="#" style="color:#067df7;text-decoration:underline" target="_blank">click here.</a></p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">Still have questions? Please contact<!-- --> <a href="#" style="color:#067df7;text-decoration:underline" target="_blank">Twitch Support</a></p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">Thanks,<br />Twitch Support Team</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:580px;margin:0 auto">
      <tbody>
        <tr>
          <td>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody style="width:100%">
                <tr style="width:100%">
                  <td align="right" data-id="__react-email-column" style="width:50%;padding-right:8px"><img src="https://react-email-demo-dr9excyry-resend.vercel.app/static/twitch-icon-twitter.png" style="display:block;outline:none;border:none;text-decoration:none" /></td>
                  <td align="left" data-id="__react-email-column" style="width:50%;padding-left:8px"><img src="https://react-email-demo-dr9excyry-resend.vercel.app/static/twitch-icon-facebook.png" style="display:block;outline:none;border:none;text-decoration:none" /></td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody style="width:100%">
                <tr style="width:100%">
                  <p style="font-size:14px;line-height:24px;margin:16px 0;text-align:center;color:#706a7b">© 2022 Twitch, All Rights Reserved <br />350 Bush Street, 2nd Floor, San Francisco, CA, 94104 - USA</p>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>`,
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

  async findSalesByPayment(statusPayment: boolean): Promise<any> {
    const sales = await this.database.sale.findMany({
      where: {
        isPayment: statusPayment,
      },
      include: {
        clients: true,
        details: true,
      },
    });

    console.log({sales});

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

  async updateSales(
    id: string,
    clientId: any,
    saleDate: any,
    details: any
  ): Promise<any> {
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
