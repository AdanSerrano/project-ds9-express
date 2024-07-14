import { Router } from "express";
import verifyTokenMiddleware from "../../middleware/jwtToken";
import VerificationService from "../../model/services/verification.services";
import PaymentModel from "../../model/payment.model";
import DatabaseService from "../../model/services/database.services";
import PaymentController from "../../controller/payment.controller";

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

      const payment = await paymentController.createPayment(
        clientId,
        saleId,
        paymentDate,
        amount
      );

      res.status(201).json({
        errorMessages: false,
        success: "Venta registrada exitosamente",
        data: {
          payment,
        },
      });
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
      console.error(error);
    }
  });

  router.get("/captureOrder", async (req, res) => {
    try {
      const { token } = req.query;

      console.log({ token });

      const payment = await paymentController.capturePayment(token);
      res.status(200).json({
        errorMessages: false,
        success: "Venta registrada exitosamente",
        data: {
          payment,
        },
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.get("/cancelOrder", async (req, res) => {
    try {
      const { token } = req.query;

      console.log({ token });

      const payment = await paymentController.cancelPayment(token);
      res.status(200).json({
        errorMessages: false,
        success: "Venta registrada exitosamente",
        data: {
          payment,
        },
      });
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  return router;
};

export default PaymentRouter;
