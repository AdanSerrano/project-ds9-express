const express = require("express");
const bcryptjs = require("bcryptjs");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
var jwt = require('jsonwebtoken');

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "Usuario no existe" });
    }

    const isValid = await bcryptjs.compare(password, existingUser.password);

    if (!isValid) {
      return res.status(401).json({ error: "Usuario o contraseña incorrecta" });
    }

    const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET || 'secret', {
      expiresIn: 60 * 60 * 24
    });

    const user = existingUser;
    return res.status(200).json({ user, token, success: "Login exitoso" });
  } catch (error) {
    console.log("Error in /login/");
    console.error(error);
  }
});

module.exports = router;