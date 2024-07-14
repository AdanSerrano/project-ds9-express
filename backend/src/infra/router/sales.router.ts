import { Router } from "express";
import verifyTokenMiddleware from "../../middleware/jwtToken";
import VerificationService from "../../model/services/verification.services";
import SaleModel from "../../model/sales.model";
import DatabaseService from "../../model/services/database.services";
import SalesController from "../../controller/sales.controller";
import { Role } from "@prisma/client";
import { Console } from "console";

const SaleRouter = (app: Router): Router => {
  const router = Router();

  const databaseService = DatabaseService.getInstance();
  const saleService = new SaleModel(databaseService);
  const verificationService = new VerificationService();
  const saleController = new SalesController(saleService, verificationService);

  router.post("/", async (req, res) => {
    try {
      const { clientId, saleDate, details } = req.body;

      const sale = await saleController.createSales(
        clientId,
        saleDate,
        details
      );

      res.status(201).json({
        errorMessages: false,
        success: "Venta registrada exitosamente",
        sale,
      });
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.get("/", verifyTokenMiddleware, async (req, res) => {
    try {
      const sales = await saleController.findAllSales();

      res.status(200).json({
        errorMessages: false,
        error: "",
        data: saleFormat(sales),
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const sale = await saleController.getOneSales(id);

      if (!sale) {
        res.status(404).json({
          errorMessages: true,
          error: "Venta no encontrada",
        });
      }
      res.status(200).json(saleFormat(sale));
    } catch (error: unknown) {
      console.log(error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const sale = await saleController.deleteSales(id);

      res.status(200).json({
        errorMessages: false,
        success: "Venta eliminada exitosamente",
        data: saleFormat(sale),
      });
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.put("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const { clientId, saleDate, details } = req.body;

      const sale = await saleController.updateSales(id, {
        clientId,
        saleDate,
        details,
      });

      res.status(200).json({
        errorMessages: false,
        success: "Venta actualizada exitosamente",
        data: saleFormat(sale),
      });
    } catch (error: unknown) {
      console.log("ERROR PUT SALE");
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  function saleFormat(sale: any) {
    if (!Array.isArray(sale)) {
      return {
        id: sale.id,
        saleDate: sale.saleDate,
        invoiceId: sale.invoiceId,
        TotalSale: sale.TotalSale,
        Payment: sale.Payment,
        PaymentPending: sale.TotalSale - sale.Payment,
        clients: {
          id: sale.clients.id,
          name: sale.clients.name,
          lastname: sale.clients.lastname,
          phoneNumber: sale.clients.phoneNumber,
          ident: sale.clients.ident,
        },
        details: sale.details.map((detail: any) => {
          const price_value =
            detail.quantity * (detail.price - detail.discount);
          const tax_value = price_value * detail.tax;
          const total_value = price_value + tax_value;

          return {
            id: detail.id,
            quantity: detail.quantity,
            product: detail.product,
            price: detail.price,
            tax: detail.tax,
            discount: parseFloat(detail.discount.toFixed(2)),
            price_total: parseFloat(price_value.toFixed(2)),
            tax_total: parseFloat(tax_value.toFixed(2)),
            total: parseFloat(total_value.toFixed(2)),
          };
        }),
      };
    } else {
      return sale.map((sale: any) => {
        return {
          id: sale.id,
          saleDate: sale.saleDate,
          invoiceId: sale.invoiceId,
          TotalSale: sale.TotalSale,
          Payment: sale.Payment,
          PaymentPending: sale.TotalSale - sale.Payment,
          clients: {
            id: sale.clients.id,
            name: sale.clients.name,
            lastname: sale.clients.lastname,
            phoneNumber: sale.clients.phoneNumber,
            ident: sale.clients.ident,
          },
          details: saleDetailsFormat(sale.details),
        };
      });
    }
  }

  function saleDetailsFormat(sale: any) {
    if (!Array.isArray(sale)) {
      const price_value = sale.quantity * (sale.price - sale.discount);
      const tax_value = price_value * sale.tax;
      const total_value = price_value + tax_value;

      return {
        id: sale.id,
        quantity: sale.quantity,
        product: sale.product,
        price: sale.price,
        tax: sale.tax,
        discount: parseFloat(sale.discount.toFixed(2)),
        price_total: parseFloat(price_value.toFixed(2)),
        tax_total: parseFloat(tax_value.toFixed(2)),
        total: parseFloat(total_value.toFixed(2)),
      };
    } else {
      return sale.map((sale: any) => {
        const price_value = sale.quantity * (sale.price - sale.discount);
        const tax_value = price_value * sale.tax;
        const total_value = price_value + tax_value;

        return {
          id: sale.id,
          quantity: sale.quantity,
          product: sale.product,
          price: sale.price,
          tax: sale.tax,
          discount: parseFloat(sale.discount.toFixed(2)),
          price_total: parseFloat(price_value.toFixed(2)),
          tax_total: parseFloat(tax_value.toFixed(2)),
          total: parseFloat(total_value.toFixed(2)),
        };
      });
    }
  }

  return router;
};

export default SaleRouter;
