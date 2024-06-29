import { Router } from "express";
import verifyTokenMiddleware from "../../middleware/jwtToken";
import VerificationService from "../../model/services/verification.services";
import UserModel from "../../model/user.model";
import DatabaseService from "../../model/services/database.services";
import UserController from "../../controller/user.controller";

const UserRouter = (app: Router): Router => {
  const router = Router();

  const databaseService = DatabaseService.getInstance();
  const userService = new UserModel(databaseService);
  const verificationService = new VerificationService();
  const userController = new UserController(userService, verificationService);

  router.post("/", verifyTokenMiddleware, async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      const userRole = role ? role : "USER";

      const resp = await userController.register(
        name,
        email,
        password,
        userRole
      );

      if(resp) {
        res.status(201).json({
          errorMessages: false,
          message: "User registered successfully",
          data: {
            id: resp.id,
            name: resp.name,
            email: resp.email,
            role: resp.role,
          },
        });
      } else {
        res.status(400).json({
          errorMessages: true,
          message: "User already exists",
        });
      }

    } catch (error: unknown) {
      res.status(500).json({ message: "Internal server error." });
    }
  });

  return router;
};

export default UserRouter;
