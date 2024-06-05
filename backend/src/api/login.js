const express = require("express");
const bcryptjs = require("bcryptjs");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  try {
    const body = req.body;

    const userInfo = await prisma.user.findMany({
      where: {
        email: body.bodyemail,
      },
    });

    console.log(userInfo);

    if (!user) {
      return res.status(400).json({ message: "Usuario o contraseña incorrecta" });
    }

    bcryptjs.compare(password, user.password).then((isValid) => {
      if (!isValid) {
        return res.status(400).json({ message: "Usuario o contraseña incorrecta" });
      }
      return res.status(200).json({ message: "Login exitoso" });
    });
  } catch (error) {
    console.log("Error in /api/login/");
    console.error(error);
  }
});

module.exports = router;