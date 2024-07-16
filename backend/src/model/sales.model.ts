import { PrismaClient } from "@prisma/client";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
class SalesModel {
  private database: PrismaClient;

  constructor(databaseInstance: PrismaClient) {
    this.database = databaseInstance;
  }

  // async updateTotalSales(saleId: string): Promise<void> {
  //   try {
  //     const saleDetails = await this.database.saleDetail.findMany({
  //       where: { saleId },
  //     });

  //     // Calculation Functions
  //     const calculateSubtotal = (detail: any) => {
  //       const price = detail.price || 0;
  //       const quantity = detail.quantity || 0;
  //       const discount = detail.discount || 0;
  //       return (price * quantity) - discount;
  //     };

  //     const calculateITBMS = (detail: any) => {
  //       const taxRate = (detail.tax || 0) / 100;
  //       return calculateSubtotal(detail) * taxRate;
  //     };

  //     const calculateTotal = (details: any[]) => {
  //       const subtotal = details.reduce((acc, detail) => acc + calculateSubtotal(detail), 0);
  //       const totalITBMS = details.reduce((acc, detail) => acc + calculateITBMS(detail), 0);
  //       return subtotal + totalITBMS;
  //     };

  //     const totalSale = calculateTotal(saleDetails);

  //     await this.database.sale.update({
  //       where: { id: saleId },
  //       data: { TotalSale: totalSale },
  //     });
  //   } catch (error) {
  //     console.error("Error updating total sales:", error);
  //     throw new Error("Failed to update total sales");
  //   }
  // }

  async createSales(clientId: any, saleDate: any, details: any): Promise<any> {
    try {
      const maxInvoiceId = await this.database.sale.findFirst({
        select: { invoiceId: true },
        orderBy: { id: "desc" },
      });

      const client = await this.database.client.findUnique({
        where: { id: clientId },
      });

      const calculateSubtotal = (detail: any) => {
        const price = detail.price || 0;
        const quantity = detail.quantity || 0;
        const discount = detail.discount || 0;
        return (price * quantity) - discount;
      };

      const calculateITBMS = (detail: any) => {
        const taxRate = (detail.tax || 0) / 100;
        return calculateSubtotal(detail) * taxRate;
      };

      const calculateTotal = (details: any[]) => {
        const subtotal = details.reduce((acc, detail) => acc + calculateSubtotal(detail), 0);
        const totalITBMS = details.reduce((acc, detail) => acc + calculateITBMS(detail), 0);
        return subtotal + totalITBMS;
      };

      const totalSale = calculateTotal(details);

      const saleCreate = await this.database.sale.create({
        data: {
          saleDate: new Date(saleDate),
          clientId: clientId,
          invoiceId: maxInvoiceId ? Number(maxInvoiceId.invoiceId) + 1 : 1,
          TotalSale: totalSale,
        },
      });

      const saleDetail = await this.database.saleDetail.createMany({
        data: details.map((detail: any) => {
          return {
            quantity: detail.quantity,
            product: detail.product,
            price: detail.price,
            tax: detail.tax,
            discount: detail.discount,
            saleId: saleCreate.id,
          };
        }),
      });

      const saleByid = await this.database.sale.findUnique({
        where: {
          id: saleCreate.id,
        },
        include: {
          clients: true,
          details: true,
        },
      });

      console.log(saleByid)

      const subtotal = totalSale;
      const itbms = totalSale * 0.07;
      const total = subtotal + itbms;

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
    </style>
  </head>
  <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Pagar Factura<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
  </div>

  <body style="background-color:rgb(255,255,255);margin-top:auto;margin-bottom:auto;margin-left:auto;margin-right:auto;font-family:ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, &quot;Helvetica Neue&quot;, Arial, &quot;Noto Sans&quot;, sans-serif, &quot;Apple Color Emoji&quot;, &quot;Segoe UI Emoji&quot;, &quot;Segoe UI Symbol&quot;, &quot;Noto Color Emoji&quot;;padding-left:0.5rem;padding-right:0.5rem">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:465px;border-width:1px;border-style:solid;border-color:rgb(234,234,234);border-radius:0.25rem;margin-top:40px;margin-bottom:40px;margin-left:auto;margin-right:auto;padding:20px">
      <tbody>
        <tr style="width:100%">
          <td>
            <h1 style="color:rgb(0,0,0);font-size:24px;font-weight:400;text-align:center;padding:0px;margin-top:30px;margin-bottom:30px;margin-left:0px;margin-right:0px">Pagar <strong>Factura</strong></h1>
            <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">Estimado cliente,</p>
            <p style="font-size:14px;line-height:24px;margin:16px 0;color:rgb(0,0,0)">A continuación, se detallan los productos de su factura:</p>

            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                </tr>
              </thead>
              <tbody>
              ${saleByid?.details.map((detail: any) => `
                <tr>
                  <td>${detail.product}</td>
                  <td>${detail.quantity}</td>
                  <td>$${detail.price.toFixed(2)}</td>
                </tr>
              `).join("")}
                <tr class="total-row">
                  <td></td>
                  <td>Subtotal</td>
                  <td>$${subtotal.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                <td></td>
                  <td>ITBMS</td>
                  <td>$${itbms.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                <td></td>
                  <td><strong>Total</strong></td>
                  <td><strong>$${total.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>

            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="text-align:center;margin-top:32px;margin-bottom:32px">
              <tbody>
                <tr>
                  <td><a href="http://localhost:3000/dashboard/orders/salesNotIsPaid/${saleCreate.id}" style="line-height:100%;text-decoration:none;display:inline-block;max-width:100%;background-color:rgb(0,0,0);border-radius:0.25rem;color:rgb(255,255,255);font-size:12px;font-weight:600;text-decoration-line:none;text-align:center;padding-left:1.25rem;padding-right:1.25rem;padding-top:0.75rem;padding-bottom:0.75rem;padding:12px 20px 12px 20px" target="_blank"><span><!--[if mso]><i style="letter-spacing: 20px;mso-font-width:-100%;mso-text-raise:18" hidden>&nbsp;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Pagar Ahora</span><span><!--[if mso]><i style="letter-spacing: 20px;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a></td>
                </tr>
              </tbody>
            </table>
            <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-width:1px;border-style:solid;border-color:rgb(234,234,234);margin-top:26px;margin-bottom:26px;margin-left:0px;margin-right:0px" />
            <p style="font-size:12px;line-height:24px;margin:16px 0;color:rgb(102,102,102)">Si tiene alguna pregunta sobre esta factura, por favor responda a este correo electrónico. Gracias por su negocio.</p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>

</html>
      `,
      });

      return saleCreate;
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
        paymentDetail: true
      },
    });

    return sale;
  }

  async findAllSales(): Promise<any> {
    var sales = await this.database.sale.findMany({
      include: {
        clients: true,
        details: true,
        paymentDetail: true
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

      const calculateSubtotal = (detail: any) => {
        const price = detail.price || 0;
        const quantity = detail.quantity || 0;
        const discount = detail.discount || 0;
        return (price * quantity) - discount;
      };

      const calculateITBMS = (detail: any) => {
        const taxRate = (detail.tax || 0) / 100;
        return calculateSubtotal(detail) * taxRate;
      };

      const calculateTotal = (details: any[]) => {
        const subtotal = details.reduce((acc, detail) => acc + calculateSubtotal(detail), 0);
        const totalITBMS = details.reduce((acc, detail) => acc + calculateITBMS(detail), 0);
        return subtotal + totalITBMS;
      };

      const totalSale = calculateTotal(details);

      await this.database.sale.update({
        where: { id: sale.id },
        data: { TotalSale: totalSale },
      });

      return await this.findUniqueSales(sale.id);
    } catch (error: unknown) {
      console.error("Error updating sales:", error);
      throw error;
    }
  }


  // async deleteSalesDetails(id: string): Promise<any> {
  //   const saleDetail = await this.database.saleDetail.findUnique({
  //     where: {
  //       id: id,
  //     },
  //   });

  //   if (!saleDetail) {
  //     return null;
  //   }

  //   await this.database.saleDetail.delete({
  //     where: {
  //       id: id,
  //     },
  //   });

  //   return saleDetail;
  // }

  // async updateSalesDetails(id: string, data: any): Promise<any> {
  //   const saleDetail = await this.database.saleDetail.findUnique({
  //     where: {
  //       id: id,
  //     },
  //   });

  //   if (!saleDetail) {
  //     return null;
  //   }

  //   await this.database.saleDetail.update({
  //     where: {
  //       id: id,
  //     },
  //     data: {
  //       quantity: data.quantity,
  //       product: data.product,
  //       price: data.price,
  //       tax: data.tax,
  //       discount: data.discount,
  //     },
  //   });
  // }

  // async createSalesDetails(saleId: any, details: any): Promise<any> {
  //   try {
  //     await this.database.saleDetail.createMany({
  //       data: details.map((detail: any) => {
  //         return {
  //           quantity: detail.quantity,
  //           product: detail.product,
  //           price: detail.price,
  //           tax: detail.tax,
  //           discount: detail.discount,
  //           saleId: saleId,
  //         };
  //       }),
  //     });
  //   } catch (error: unknown) {
  //     console.log("error createSalesDetails");
  //     console.error(error);
  //     return null;
  //   }
  // }

  // async findUniqueSalesDetails(id: string): Promise<any> {
  //   const saleDetail = await this.database.saleDetail.findUnique({
  //     where: {
  //       id: id,
  //     },
  //   });

  //   return saleDetail;
  // }
}

export default SalesModel;
