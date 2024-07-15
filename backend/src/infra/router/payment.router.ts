// payment.router.ts
import { Router } from "express";
import PaymentController from "../../controller/payment.controller";
import DatabaseService from "../../model/services/database.services";
import PaymentModel from "../../model/payment.model";
import VerificationService from "../../model/services/verification.services";

const PaymentRouter = (app: Router): Router => {
  const router = Router();
  const databaseService = DatabaseService.getInstance();
  const paymentService = new PaymentModel(databaseService);
  const verificationService = new VerificationService();
  const paymentController = new PaymentController(
    paymentService,
    verificationService
  );

  router.post("/", async (req, res) => {
    try {
      const { clientId, saleId, paymentDate, amount } = req.body;
      const order = await paymentController.createPayment(clientId, saleId, paymentDate, amount);
      res.json(order);

      // res.status(201).json({
      //   errorMessages: false,
      //   success: "Venta registrada exitosamente",
      //   data: {
      //     payment,
      //   },
      // });
    } catch (error) {
      res.status(500).json({ error: "Error creating PayPal order" });
    }
  });

  router.get("/captureOrder", async (req, res) => {
    try {
      const { token } = req.query;
      const captureData = await paymentController.capturePayment(token as string);
      res.json(captureData);
      // res.status(200).json({
      //   errorMessages: false,
      //   success: "Venta registrada exitosamente",
      //   data: {
      //     payment,
      //   },
      // });
    } catch (error) {
      res.status(500).json({ error: "Error capturing PayPal payment" });
    }
  });

  router.get("/cancelPayment", async (req, res) => {
    try {
      const { token } = req.query;
      const cancelData = await paymentController.cancelPayment(token as string);
      res.json(cancelData);
      // res.status(200).json({
      //   errorMessages: false,
      //   success: "Venta registrada exitosamente",
      //   data: {
      //     payment,
      //   },
      // });
    } catch (error) {
      res.status(500).json({ error: "Error cancelling PayPal payment" });
    }
  });

  return router;
};

export default PaymentRouter;