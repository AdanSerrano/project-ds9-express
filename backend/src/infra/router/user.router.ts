import { Router } from "express";
import verifyTokenMiddleware from "../../middleware/jwtToken";
import VerificationService from "../../model/services/verification.services";
import UserModel from "../../model/user.model";
import DatabaseService from "../../model/services/database.services";
import UserController from "../../controller/user.controller";
import { Role } from "@prisma/client";

const UserRouter = (app: Router): Router => {
  const router = Router();

  const databaseService = DatabaseService.getInstance();
  const userService = new UserModel(databaseService);
  const verificationService = new VerificationService();
  const userController = new UserController(userService, verificationService);

  router.post("/", async (req, res) => {
    try {
      const { name, email, password, role } = req.body;

      const userRole = role ? role : Role.USER;

      const resp = await userController.register(
        name,
        email,
        password,
        userRole
      );

      if (resp) {
        res.status(201).json({
          errorMessages: false,
          success: "Usuario registrado exitosamente",
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
          error: "Este usuario ya existe",
        });
      }
    } catch (error: unknown) {
      res.status(500).json({ error: "Internal server error." });
    }
  });

  router.get("/", verifyTokenMiddleware, async (req, res) => {
    try {
      const users = await userController.findAllUsers();

      res.status(200).json({
        errorMessages: false,
        data: {
          users: users.map((user: any) => {
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }),
        },
      });
    } catch (error: unknown) {
      res.status(500).json({ message: "Internal server error." });
    }
  });

  router.get("/:email", verifyTokenMiddleware, async (req, res) => {
    try {
      const email = req.params.email;

      const user = await userService.findUnique(email);

      if (user) {
        res.status(200).json({
          errorMessages: false,
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      } else {
        res.status(400).json({
          errorMessages: true,
          message: "User not found",
        });
      }
    } catch (error: unknown) {
      res.status(500).json({ message: "Internal server error." });
    }
  });

  router.put("/", verifyTokenMiddleware, async (req, res) => {
    try {
      const { email, name, role } = req.body;
      const userRole = role ? role : "USER";

      const resp = await userController.updateUser(email, name, userRole);

      if (resp) {
        res.status(200).json({
          errorMessages: false,
          message: "User updated successfully",
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
          message: "User not found",
        });
      }
    } catch (error: unknown) {
      res.status(500).json({ message: "Internal server error." });
    }
  });

  router.put("/changePassword", verifyTokenMiddleware, async (req, res) => {
    try {
      const { email, passwordOld, newPassword } = req.body;

      const resp = await userController.changePassword(
        email,
        passwordOld,
        newPassword
      );

      if (resp) {
        res.status(200).json({
          errorMessages: false,
          message: "Password changed successfully",
        });
      } else {
        res.status(400).json({
          errorMessages: true,
          message: "User not found or password is incorrect",
        });
      }
    } catch (error: unknown) {
      res.status(500).json({ message: "Internal server error." });
    }
  });

  router.delete("/:email", verifyTokenMiddleware, async (req, res) => {
    try {
      const email = req.params.email;

      const resp = await userController.deleteUser(email);

      if (resp) {
        res.status(200).json({
          errorMessages: false,
          message: "User deleted successfully",
        });
      } else {
        res.status(400).json({
          errorMessages: true,
          message: "User not found",
        });
      }
    } catch (error: unknown) {
      res.status(500).json({ message: "Internal server error." });
    }
  });

  return router;
};

export default UserRouter;
