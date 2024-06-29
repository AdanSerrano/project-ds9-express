import { Router } from "express";
import VerificationService from "../../model/services/verification.services";
import AuthModel from "../../model/auth.model";
import DatabaseService from "../../model/services/database.services";
import AuthController from "../../controller/auth.controller";

const AuthRouter = (app: Router): Router => {
  const router = Router();

  const databaseService = DatabaseService.getInstance();
  const authService = new AuthModel(databaseService);
  const verificationService = new VerificationService();
  const authController = new AuthController(authService, verificationService);

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const accessToken = await authController.login(email, password);

      if (!accessToken) {
        res.status(401).json({
          errorMessage: true,
          message: "Invalid email or password.",
        });
      }

      res.status(200).json({
        errorMessage: false,
        message: "User logged in successfully",
        token: accessToken,
      });
    } catch (error: unknown) {
      res
        .status(500)
        .json({ errorMessage: true, message: "Internal server error." });
    }
  });
  
  return router;
};

export default AuthRouter;
