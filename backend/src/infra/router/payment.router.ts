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
        success: "Pago registrado exitosamente",
        payment,
      });
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.get("/", verifyTokenMiddleware, async (req, res) => {
    try {
      const payments = await paymentController.findAllPayments();

      res.status(200).json(payments);
    } catch (error: unknown) {
      console.error(error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await paymentController.getOnePayment(id);

      if (!payment) {
        res.status(404).json({
          errorMessages: true,
          error: "Pago no encontrado",
        });
      }
      res.status(200).json(payment);
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  return app.use("/payments", router);
};

export default PaymentRouter;