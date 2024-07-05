import { Router } from "express";
import verifyTokenMiddleware from "../../middleware/jwtToken";
import VerificationService from "../../model/services/verification.services";
import SaleModel from "../../model/sales.model";
import DatabaseService from "../../model/services/database.services";
import SalesController from "../../controller/sales.controller";
import { Role } from "@prisma/client";

const SaleRouter = (app: Router): Router => {
  const router = Router();

  const databaseService = DatabaseService.getInstance();
  const saleService = new SaleModel(databaseService);
  const verificationService = new VerificationService();
  const saleController = new SalesController(saleService, verificationService);

  router.post("/", async (req, res) => {
    try {
      const { clientId, saleDate, details } = req.body;

      console.log({clientId, saleDate, details});

      const resp = await saleController.createSales(clientId, saleDate, details);

      /*if (resp) {
        res.status(201).json({
          errorMessages: false,
          success: "Venta registrada exitosamente",
          data: {
            id: resp.id,
            clientId: resp.clientId,
            saleDate: resp.saleDate,
          },
        });
      } else {
        res.status(400).json({
          errorMessages: true,
          error: "Esta venta ya existe",
        });
      }*/

        res.status(201).json({
            errorMessages: false,
            success: "Venta registrada exitosamente",
            data: {
            id: 1,
            clientId: 1,
            saleDate: "2021-10-10",
            },
        });
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.get("/", verifyTokenMiddleware, async (req, res) => {
    try {
      const sale = await saleController.findAllSales();

      res.status(200).json({
        errorMessages: false,
        data: sale.map((sale: any) => {
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
          };
        }),
      });
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.get("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const sale = await saleController.getOneSales(id);

      res.status(200).json({
        errorMessages: false,
        data: {
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
            var price_value = detail.quantity * (detail.price - detail.discount) 
            var tax_value = price_value * detail.tax
            var total_value = price_value + tax_value

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
        },
      });
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  /* router.delete("/:id", verifyTokenMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const sale = await saleController.deleteSales(id);

      res.status(200).json({
        errorMessages: false,
        success: "Venta eliminada exitosamente",
        data: {
          id: sale.id,
          clientId: sale.clientId,
          saleDate: sale.saleDate,
        },
      });
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });*/

  return router;
};

export default SaleRouter;
