import { Router } from "express";
import VerificationService from "../../model/services/verification.services";
import AuthModel from "../../model/auth.model";
import DatabaseService from "../../model/services/database.services";
import AuthController from "../../controller/auth.controller";
import { error } from "console";

const AuthRouter = (app: Router): Router => {
  const router = Router();

  const databaseService = DatabaseService.getInstance();
  const authService = new AuthModel(databaseService);
  const verificationService = new VerificationService();
  const authController = new AuthController(authService, verificationService);

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const loginResult = await authController.login(email, password);

      if (!loginResult) {
        res.status(401).json({
          errorMessage: true,
          error: "Login no successful. Please try again.",
        });
      }

      res.status(200).json({
        errorMessage: false,
        success: "User logged in successfully",
        token: loginResult.accessToken,
        userInfo: loginResult.userInfo,
      });

    } catch (error: unknown) {
      console.log(error);
      res
        .status(500)
        .json({ errorMessage: true, error: "Internal server error." });
    }
  });

  return router;
};

export default AuthRouter;
