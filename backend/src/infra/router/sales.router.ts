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

      if (sale) {
        res.status(201).json({
          errorMessages: false,
          success: "Venta registrada exitosamente",
          data: saleFormat(sale),
        });
      } else {
        res.status(400).json({
          errorMessages: true,
          error: "Esta venta ya existe",
        });
      }
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.get("/", verifyTokenMiddleware, async (req, res) => {
    try {
      const sale = await saleController.findAllSales();

      console.log();

      res.status(200).json({
        errorMessages: false,
        data: saleFormat(sale),
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.get("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const sale = await saleController.getOneSales(id);

      res.status(200).json({
        errorMessages: false,
        data: saleFormat(sale),
      });
    } catch (error: unknown) {
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

  router.delete("/details/:id", verifyTokenMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const sale = await saleController.deleteSalesDetails(id);

      res.status(200).json({
        errorMessages: false,
        success: "Detalle eliminado exitosamente",
        data: saleFormat(sale),
      });
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.put("/details/", verifyTokenMiddleware, async (req, res) => {
    try {
      const { details, id } = req.body;
      const sale = await saleController.updateSalesDetails(id, details);

      res.status(200).json({
        errorMessages: false,
        success: "Detalle actualizado exitosamente",
        data: saleFormat(sale),
      });
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.post("/details/", verifyTokenMiddleware, async (req, res) => {
    try {
      const { saleId, details } = req.body;
      const sale = await saleController.createSalesDetails(saleId, details);

      console.log(sale);

      res.status(200).json({
        errorMessages: false,
        success: "Detalle registrado exitosamente",
        data: saleFormat(sale),
      });
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.get("/details/:id", verifyTokenMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const sale = await saleController.findUniqueSalesDetails(id);

      res.status(200).json({
        errorMessages: false,
        data: saleDetailsFormat(sale),
      });
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  

  function saleFormat(sale: any) {
    if (!Array.isArray(sale)) {
      return {
        id: sale.id,
        saleDate: sale.saleDate,
        clients: {
          id: sale.clients.id,
          name: sale.clients.name,
          lastname: sale.clients.lastname,
          phoneNumber: sale.clients.phoneNumber,
          ident: sale.clients.ident,
        },
        details: sale.details.map((detail: any) => {
          var price_value = detail.quantity * (detail.price - detail.discount);
          var tax_value = price_value * detail.tax;
          var total_value = price_value + tax_value;

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
      var price_value = sale.quantity * (sale.price - sale.discount);
      var tax_value = price_value * sale.tax;
      var total_value = price_value + tax_value;

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
        var price_value = sale.quantity * (sale.price - sale.discount);
        var tax_value = price_value * sale.tax;
        var total_value = price_value + tax_value;

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
